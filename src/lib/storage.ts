import path from "path";
import fs from "fs/promises";
import { env } from "./env";

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface StorageAdapter {
  upload(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    siteId: string
  ): Promise<UploadResult>;
  delete(fileUrl: string): Promise<void>;
}

// ── Local Storage Adapter ─────────────────────────────────────────

class LocalStorageAdapter implements StorageAdapter {
  async upload(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    siteId: string
  ): Promise<UploadResult> {
    const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR, siteId);
    await fs.mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = sanitizeFileName(fileName);
    const uniqueName = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, uniqueName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `${env.NEXT_PUBLIC_UPLOADS_URL}/${siteId}/${uniqueName}`;

    let width: number | undefined;
    let height: number | undefined;

    if (mimeType.startsWith("image/")) {
      try {
        const sharp = (await import("sharp")).default;
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;
      } catch {
        // sharp pode não estar disponível em todos os ambientes
      }
    }

    return {
      fileName: uniqueName,
      fileUrl,
      mimeType,
      size: buffer.length,
      width,
      height,
    };
  }

  async delete(fileUrl: string): Promise<void> {
    const relativePath = fileUrl.replace(env.NEXT_PUBLIC_UPLOADS_URL, "");
    const filePath = path.join(process.cwd(), env.UPLOAD_DIR, relativePath);
    await fs.unlink(filePath).catch(() => {});
  }
}

// ── Storage Factory ───────────────────────────────────────────────

function createStorageAdapter(): StorageAdapter {
  switch (env.STORAGE_PROVIDER) {
    case "local":
      return new LocalStorageAdapter();
    default:
      return new LocalStorageAdapter();
  }
}

export const storage = createStorageAdapter();

// ── Helpers ───────────────────────────────────────────────────────

export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateUploadFile(
  mimeType: string,
  size: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido: ${mimeType}`,
    };
  }
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
}
