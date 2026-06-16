import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { saveBlocks } from "@/server/services/pageService";
import { saveBlocksSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; pageId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, pageId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const body = await request.json();
    const { blocks } = saveBlocksSchema.parse(body);
    const page = await saveBlocks(pageId, siteId, blocks);
    return Response.json({ data: page, message: "Blocos salvos." });
  } catch (err) {
    return handleApiError(err);
  }
}
