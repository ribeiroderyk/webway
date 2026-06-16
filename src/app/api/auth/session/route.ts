import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ data: null });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { members: { some: { userId: session.user.id } } },
    select: { id: true, name: true, slug: true },
  });

  return Response.json({
    data: {
      user: session.user,
      workspace,
    },
  });
}
