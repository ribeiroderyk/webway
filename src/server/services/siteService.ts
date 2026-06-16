// Changed: getDashboardStats returns flat shape matching dashboard page; getSiteById accepts workspaceId guard
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { Prisma } from "@prisma/client";

interface CreateSiteInput {
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  language?: string;
  primaryColor?: string;
}

interface ListSitesInput {
  workspaceId: string;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  page?: number;
  perPage?: number;
}

export async function createSite(input: CreateSiteInput) {
  const slug = input.slug || slugify(input.name);

  const existing = await prisma.site.findFirst({
    where: { workspaceId: input.workspaceId, slug },
  });

  if (existing) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }

  return prisma.site.create({
    data: {
      workspaceId: input.workspaceId,
      name: input.name,
      slug,
      description: input.description,
      language: input.language ?? "pt-BR",
      primaryColor: input.primaryColor ?? "#6366f1",
      status: "DRAFT",
      pages: {
        create: {
          title: "Home",
          slug: "/",
          status: "DRAFT",
          showInNav: false,
          navOrder: 0,
          blocks: [],
        },
      },
    },
    include: {
      pages: { take: 1 },
    },
  });
}

export async function listSites(input: ListSitesInput) {
  const { workspaceId, search, status, page = 1, perPage = 12 } = input;

  const where: Prisma.SiteWhereInput = {
    workspaceId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [sites, total] = await Promise.all([
    prisma.site.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        _count: {
          select: { pages: true, posts: true, media: true },
        },
      },
    }),
    prisma.site.count({ where }),
  ]);

  return {
    sites,
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getSiteById(siteId: string, workspaceId?: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      _count: {
        select: { pages: true, posts: true, media: true },
      },
    },
  });

  // Enforce workspace ownership when caller provides workspaceId
  if (site && workspaceId && site.workspaceId !== workspaceId) return null;

  return site;
}

export async function updateSite(siteId: string, data: Prisma.SiteUpdateInput) {
  return prisma.site.update({ where: { id: siteId }, data });
}

export async function deleteSite(siteId: string) {
  return prisma.site.delete({ where: { id: siteId } });
}

export async function getDashboardStats(workspaceId: string) {
  const [totalSites, publishedSites, totalPages, publishedPages, totalPosts, totalMedia, seoPages, hasSeoConfig] =
    await Promise.all([
      prisma.site.count({ where: { workspaceId } }),
      prisma.site.count({ where: { workspaceId, status: "PUBLISHED" } }),
      prisma.page.count({ where: { site: { workspaceId } } }),
      prisma.page.count({ where: { site: { workspaceId }, status: "PUBLISHED" } }),
      prisma.post.count({ where: { site: { workspaceId } } }),
      prisma.media.count({ where: { site: { workspaceId } } }),
      prisma.page.findMany({
        where: { site: { workspaceId }, seoScore: { not: null } },
        select: { seoScore: true, siteId: true },
      }),
      prisma.page.count({ where: { site: { workspaceId }, seoTitle: { not: null } } }),
    ]);

  const averageSeoScore =
    seoPages.length > 0
      ? Math.round(seoPages.reduce((sum, p) => sum + (p.seoScore ?? 0), 0) / seoPages.length)
      : null;

  const sitesWithIssues =
    seoPages.length > 0
      ? new Set(seoPages.filter((p) => (p.seoScore ?? 100) < 70).map((p) => p.siteId)).size
      : 0;

  return {
    totalSites,
    publishedSites,
    totalPages,
    publishedPages,
    totalPosts,
    totalMedia,
    hasSeoConfig: hasSeoConfig > 0,
    seoHealth: { averageScore: averageSeoScore, sitesWithIssues },
  };
}
