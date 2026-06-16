import { prisma } from "@/lib/prisma";

export async function listRedirects(siteId: string) {
  return prisma.redirect.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRedirect(
  siteId: string,
  data: { fromPath: string; toPath: string; statusCode?: number }
) {
  const fromPath = data.fromPath.startsWith("/") ? data.fromPath : `/${data.fromPath}`;
  const toPath = data.toPath.startsWith("/") || data.toPath.startsWith("http")
    ? data.toPath
    : `/${data.toPath}`;

  const existing = await prisma.redirect.findUnique({
    where: { siteId_fromPath: { siteId, fromPath } },
  });
  if (existing) throw new Error("REDIRECT_ALREADY_EXISTS");

  return prisma.redirect.create({
    data: { siteId, fromPath, toPath, statusCode: data.statusCode ?? 301 },
  });
}

export async function deleteRedirect(redirectId: string, siteId: string) {
  return prisma.redirect.delete({ where: { id: redirectId, siteId } });
}

export async function findRedirect(siteId: string, fromPath: string) {
  return prisma.redirect.findUnique({
    where: { siteId_fromPath: { siteId, fromPath } },
  });
}
