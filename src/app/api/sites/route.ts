// Changed: fixed listSites/createSite call signatures to match service interfaces
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createSite, listSites } from "@/server/services/siteService";
import { createSiteSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 12);
    const search = searchParams.get("search") ?? undefined;

    const result = await listSites({
      workspaceId: session.user.workspaceId,
      page,
      perPage,
      search,
    });
    return Response.json({ data: result });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const input = createSiteSchema.parse(body);

    const site = await createSite({
      workspaceId: session.user.workspaceId,
      ...input,
    });
    return Response.json({ data: site, message: "Site criado com sucesso." }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
