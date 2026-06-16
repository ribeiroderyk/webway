import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createPost, listPosts } from "@/server/services/postService";
import { createPostSchema } from "@/lib/validators";
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
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 20);

    const result = await listPosts(siteId, { page, perPage });
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

    const body = await request.json();
    const input = createPostSchema.parse(body);
    const post = await createPost(siteId, session.user.id, input);
    return Response.json({ data: post, message: "Post criado." }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
