import { prisma } from "@/lib/prisma";
import { storage, validateUploadFile } from "@/lib/storage";
import type { Prisma } from "@prisma/client";

interface UploadMediaInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

// Changed: siteId as first positional arg to match API route call site
export async function uploadMedia(siteId: string, input: UploadMediaInput) {
  const validation = validateUploadFile(input.mimeType, input.size);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const result = await storage.upload(input.buffer, input.originalName, input.mimeType, siteId);

  return prisma.media.create({
    data: {
      siteId,
      fileName: result.fileName,
      originalName: input.originalName,
      fileUrl: result.fileUrl,
      mimeType: result.mimeType,
      size: result.size,
      width: result.width ?? null,
      height: result.height ?? null,
    },
  });
}

export async function listMedia(
  siteId: string,
  options?: { search?: string; type?: string; page?: number; perPage?: number }
) {
  const { search, type, page = 1, perPage = 24 } = options ?? {};

  const where: Prisma.MediaWhereInput = {
    siteId,
    ...(search && { fileName: { contains: search, mode: "insensitive" } }),
    ...(type === "image" && { mimeType: { startsWith: "image/" } }),
    ...(type === "document" && { mimeType: { not: { startsWith: "image/" } } }),
  };

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.media.count({ where }),
  ]);

  return { media, total, totalPages: Math.ceil(total / perPage) };
}

export async function updateMedia(
  mediaId: string,
  siteId: string,
  data: { altText?: string; caption?: string }
) {
  return prisma.media.update({
    where: { id: mediaId, siteId },
    data,
  });
}

export async function deleteMedia(mediaId: string, siteId: string) {
  const media = await prisma.media.findFirst({
    where: { id: mediaId, siteId },
  });

  if (!media) throw new Error("NOT_FOUND");

  await storage.delete(media.fileUrl);
  await prisma.media.delete({ where: { id: mediaId } });
}
