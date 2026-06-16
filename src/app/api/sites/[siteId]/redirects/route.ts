import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { listRedirects, createRedirect } from "@/server/services/redirectService";
import { z } from "zod";

const createSchema = z.object({
  fromPath: z.string().min(1).max(500),
  toPath: z.string().min(1).max(2000),
  statusCode: z.union([z.literal(301), z.literal(302)]).default(301),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const redirects = await listRedirects(siteId);
  return NextResponse.json({ redirects });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId } = await params;
  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json() as unknown;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const redirect = await createRedirect(siteId, parsed.data);
    return NextResponse.json({ redirect }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "REDIRECT_ALREADY_EXISTS") {
      return NextResponse.json({ error: "Já existe um redirect para esse caminho" }, { status: 409 });
    }
    throw err;
  }
}
