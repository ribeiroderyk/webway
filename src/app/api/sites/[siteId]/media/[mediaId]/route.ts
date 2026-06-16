import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateMedia, deleteMedia } from "@/server/services/mediaService";
import { updateMediaSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; mediaId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, mediaId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const body = await request.json();
    const input = updateMediaSchema.parse(body);
    const media = await updateMedia(mediaId, siteId, input);
    return Response.json({ data: media, message: "Mídia atualizada." });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; mediaId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, mediaId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    await deleteMedia(mediaId, siteId);
    return Response.json({ message: "Mídia removida." });
  } catch (err) {
    return handleApiError(err);
  }
}
