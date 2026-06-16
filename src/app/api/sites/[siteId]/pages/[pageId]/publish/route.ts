import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { publishPage, unpublishPage } from "@/server/services/pageService";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; pageId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, pageId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    const page = await publishPage(pageId, siteId);
    return Response.json({ data: page, message: "Página publicada." });
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
    const page = await unpublishPage(pageId, siteId);
    return Response.json({ data: page, message: "Página despublicada." });
  } catch (err) {
    return handleApiError(err);
  }
}
