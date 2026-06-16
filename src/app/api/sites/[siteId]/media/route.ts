import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadMedia, listMedia } from "@/server/services/mediaService";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? undefined;
    const page = Number(searchParams.get("page") ?? 1);

    const result = await listMedia(siteId, { type, page, perPage: 50 });
    return Response.json({ data: result });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Arquivo não encontrado." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await uploadMedia(siteId, {
      buffer,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });

    return Response.json({ data: media, message: "Arquivo enviado." }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
