import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { publishPost } from "@/server/services/postService";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; postId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, postId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    const post = await publishPost(postId, siteId);
    return Response.json({ data: post, message: "Post publicado." });
  } catch (err) {
    return handleApiError(err);
  }
}
