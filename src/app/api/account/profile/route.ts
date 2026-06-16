import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/permissions";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const input = updateProfileSchema.parse(body);

    // Check email uniqueness if email is being changed
    if (input.email && input.email !== session.user.email) {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        return Response.json({ error: "Este e-mail já está em uso." }, { status: 409 });
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.email && { email: input.email }),
      },
      select: { id: true, name: true, email: true },
    });

    return Response.json({ data: user, message: "Perfil atualizado." });
  } catch (err) {
    return handleApiError(err);
  }
}
