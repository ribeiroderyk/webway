import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { deleteRedirect } from "@/server/services/redirectService";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string; redirectId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { siteId, redirectId } = await params;
  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteRedirect(redirectId, siteId);
  return NextResponse.json({ ok: true });
}
