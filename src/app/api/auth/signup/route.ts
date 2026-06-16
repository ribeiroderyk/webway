import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { slugify } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Dados inválidos",
          code: "VALIDATION_ERROR",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json(
        { error: "Este e-mail já está cadastrado", code: "EMAIL_EXISTS" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const workspaceSlug = slugify(`${name.split(" ")[0]}-workspace-${Date.now()}`);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        workspaceMembers: {
          create: {
            role: "OWNER",
            workspace: {
              create: {
                name: `${name.split(" ")[0]} Workspace`,
                slug: workspaceSlug,
                ownerId: "",
              },
            },
          },
        },
      },
      select: { id: true, name: true, email: true },
    });

    // Update ownerId after creation
    await prisma.workspace.update({
      where: { slug: workspaceSlug },
      data: { ownerId: user.id },
    });

    await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
    });

    return Response.json(
      { data: { user }, message: "Conta criada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no signup:", error);
    return Response.json(
      { error: "Erro interno do servidor", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
