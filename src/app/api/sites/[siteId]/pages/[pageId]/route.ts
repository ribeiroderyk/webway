import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getPageWithBlocks,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
} from "@/server/services/pageService";
import { updatePageMetaSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; pageId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, pageId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const page = await getPageWithBlocks(pageId, siteId);
    if (!page) return Response.json({ error: "Página não encontrada." }, { status: 404 });
    return Response.json({ data: page });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; pageId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, pageId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const body = await request.json();
    const input = updatePageMetaSchema.parse(body);
    const page = await updatePage(pageId, siteId, input);
    return Response.json({ data: page, message: "Página atualizada." });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; pageId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, pageId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    await deletePage(pageId, siteId);
    return Response.json({ message: "Página excluída." });
  } catch (err) {
    return handleApiError(err);
  }
}
