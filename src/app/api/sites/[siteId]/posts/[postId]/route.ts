import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPost, updatePost, deletePost, publishPost } from "@/server/services/postService";
import { updatePostSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; postId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, postId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const post = await getPost(postId, siteId);
    if (!post) return Response.json({ error: "Post não encontrado." }, { status: 404 });
    return Response.json({ data: post });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; postId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, postId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);

    const body = await request.json();
    const input = updatePostSchema.parse(body);
    const post = await updatePost(postId, siteId, input);
    return Response.json({ data: post, message: "Post atualizado." });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; postId: string }> }
) {
  try {
    const session = await requireAuth();
    const { siteId, postId } = await params;
    await requireSiteAccess(siteId, session.user.workspaceId);
    await deletePost(postId, siteId);
    return Response.json({ message: "Post excluído." });
  } catch (err) {
    return handleApiError(err);
  }
}
