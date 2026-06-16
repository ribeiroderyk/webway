// Changed: removed plan field (not in schema); workspace has id/name/slug only
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/permissions";
import { z } from "zod";

const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const workspace = await prisma.workspace.findUniqueOrThrow({
      where: { id: session.user.workspaceId },
      select: { id: true, name: true, slug: true },
    });
    return Response.json({ data: { ...workspace, plan: "FREE" } });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { name } = updateWorkspaceSchema.parse(body);

    const workspace = await prisma.workspace.update({
      where: { id: session.user.workspaceId },
      data: { ...(name && { name }) },
      select: { id: true, name: true, slug: true },
    });

    return Response.json({ data: { ...workspace, plan: "FREE" }, message: "Workspace atualizado." });
  } catch (err) {
    return handleApiError(err);
  }
}
