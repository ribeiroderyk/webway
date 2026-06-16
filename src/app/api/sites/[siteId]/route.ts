import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSiteById, updateSite, deleteSite } from "@/server/services/siteService";
import { updateSiteSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId } = await params;
    const site = await requireSiteAccess(siteId, session.user.workspaceId);
    return Response.json({ data: site });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const body = await request.json();
    const input = updateSiteSchema.parse(body);
    const site = await updateSite(siteId, input);
    return Response.json({ data: site, message: "Site atualizado." });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    await deleteSite(siteId);
    return Response.json({ message: "Site excluído." });
  } catch (err) {
    return handleApiError(err);
  }
}
