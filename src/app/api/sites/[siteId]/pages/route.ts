import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createPage, listPages } from "@/server/services/pageService";
import { createPageSchema } from "@/lib/validators";
import { handleApiError, requireSiteAccess } from "@/lib/permissions";
import { getTemplate } from "@/lib/templates";

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
    const perPage = Number(searchParams.get("perPage") ?? 50);
    const search = searchParams.get("search") ?? undefined;

    const result = await listPages(siteId, { page, perPage, search });
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
    const input = createPageSchema.parse(body);
    const templateBlocks = input.template ? (getTemplate(input.template)?.blocks ?? []) : [];
    const newPage = await createPage(siteId, { ...input, templateBlocks });
    return Response.json({ data: newPage, message: "Página criada." }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
