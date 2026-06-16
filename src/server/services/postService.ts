import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { Prisma } from "@prisma/client";

interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
}

// Changed: signature changed to (siteId, authorId, input) to match all call sites
export async function createPost(siteId: string, authorId: string, input: CreatePostInput) {
  const slug = input.slug || slugify(input.title);

  const existing = await prisma.post.findUnique({
    where: { siteId_slug: { siteId, slug } },
  });

  if (existing) throw new Error("SLUG_ALREADY_EXISTS");

  return prisma.post.create({
    data: {
      siteId,
      authorId,
      title: input.title,
      slug,
      excerpt: input.excerpt,
      status: "DRAFT",
      content: {},
    },
  });
}

export async function listPosts(
  siteId: string,
  options?: { search?: string; status?: "DRAFT" | "PUBLISHED"; page?: number; perPage?: number }
) {
  const { search, status, page = 1, perPage = 20 } = options ?? {};

  const where: Prisma.PostWhereInput = {
    siteId,
    ...(status && { status }),
    ...(search && { title: { contains: search, mode: "insensitive" } }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, totalPages: Math.ceil(total / perPage) };
}

// Changed: parameter order swapped to (postId, siteId) to match all call sites
export async function getPost(postId: string, siteId: string) {
  return prisma.post.findFirst({
    where: { id: postId, siteId },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
}

export async function updatePost(
  postId: string,
  siteId: string,
  data: Prisma.PostUpdateInput
) {
  return prisma.post.update({ where: { id: postId, siteId }, data });
}

export async function publishPost(postId: string, siteId: string) {
  return prisma.post.update({
    where: { id: postId, siteId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export async function deletePost(postId: string, siteId: string) {
  return prisma.post.delete({ where: { id: postId, siteId } });
}

// Para renderização pública
export async function getPublishedPost(siteSlug: string, postSlug: string) {
  return prisma.post.findFirst({
    where: {
      slug: postSlug,
      status: "PUBLISHED",
      site: { slug: siteSlug, status: "PUBLISHED" },
    },
    include: {
      author: { select: { name: true } },
      site: { select: { id: true, name: true, slug: true, language: true, primaryColor: true } },
    },
  });
}

export async function listPublishedPosts(siteSlug: string, page = 1, perPage = 10) {
  const where: Prisma.PostWhereInput = {
    status: "PUBLISHED",
    site: { slug: siteSlug, status: "PUBLISHED" },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / perPage) };
}
