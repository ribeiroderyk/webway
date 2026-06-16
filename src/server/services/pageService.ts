// Changed: createPage(siteId, input), getPageWithBlocks(pageId, siteId), listPages pagination added
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { auditPageSeo } from "@/lib/seo";
import type { Block } from "@/types";
import type { Prisma } from "@prisma/client";

interface CreatePageInput {
  title: string;
  slug: string;
  templateBlocks?: Block[];
}

export async function createPage(siteId: string, input: CreatePageInput) {
  const slug = input.slug || slugify(input.title);

  const existing = await prisma.page.findUnique({
    where: { siteId_slug: { siteId, slug } },
  });

  if (existing) throw new Error("SLUG_ALREADY_EXISTS");

  return prisma.page.create({
    data: {
      siteId,
      title: input.title,
      slug,
      status: "DRAFT",
      blocks: (input.templateBlocks as Prisma.InputJsonValue) ?? [],
    },
  });
}

export async function listPages(
  siteId: string,
  options?: { search?: string; status?: "DRAFT" | "PUBLISHED"; page?: number; perPage?: number }
) {
  const { search, status, page = 1, perPage = 100 } = options ?? {};

  const where: Prisma.PageWhereInput = {
    siteId,
    ...(status && { status }),
    ...(search && {
      title: { contains: search, mode: "insensitive" },
    }),
  };

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where,
      orderBy: [{ navOrder: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        showInNav: true,
        navOrder: true,
        updatedAt: true,
        publishedAt: true,
        seoTitle: true,
        seoDescription: true,
        ogImageUrl: true,
        seoScore: true,
      },
    }),
    prisma.page.count({ where }),
  ]);

  return { pages, total, page, totalPages: Math.ceil(total / perPage) };
}

// Changed: (pageId, siteId) order to match all call sites
export async function getPageWithBlocks(pageId: string, siteId: string) {
  return prisma.page.findFirst({
    where: { id: pageId, siteId },
  });
}

export async function updatePage(
  pageId: string,
  siteId: string,
  data: Prisma.PageUpdateInput
) {
  return prisma.page.update({
    where: { id: pageId, siteId },
    data,
  });
}

export async function saveBlocks(
  pageId: string,
  siteId: string,
  blocks: Block[]
) {
  if (blocks.length > 50) {
    throw new Error("Máximo de 50 blocos por página");
  }

  const page = await prisma.page.update({
    where: { id: pageId, siteId },
    data: {
      blocks: blocks as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
  });

  // Recalculate SEO score asynchronously after block save
  void updateSeoAudit(pageId, page).catch(console.error);

  return page;
}

export async function publishPage(pageId: string, siteId: string) {
  return prisma.page.update({
    where: { id: pageId, siteId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
}

export async function unpublishPage(pageId: string, siteId: string) {
  return prisma.page.update({
    where: { id: pageId, siteId },
    data: { status: "DRAFT" },
  });
}

export async function deletePage(pageId: string, siteId: string) {
  return prisma.page.delete({ where: { id: pageId, siteId } });
}

async function updateSeoAudit(
  pageId: string,
  page: {
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    slug: string;
    status: string;
    ogTitle?: string | null;
    ogImageUrl: string | null;
    blocks: unknown;
  }
) {
  const blocks = (Array.isArray(page.blocks) ? page.blocks : []) as Block[];
  const { score } = auditPageSeo(
    {
      title: page.title,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      slug: page.slug,
      status: page.status,
      ogTitle: page.ogTitle ?? null,
      ogImageUrl: page.ogImageUrl,
    },
    blocks
  );

  // Update the SEO score directly on the page (avoid SeoAudit id conflict with cuid default)
  await prisma.page.update({
    where: { id: pageId },
    data: { seoScore: score },
  });
}
