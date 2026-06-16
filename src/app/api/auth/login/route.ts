import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "E-mail ou senha incorretos", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true, avatarUrl: true, role: true },
    });

    // Usar timing constante para evitar user enumeration
    const hash = user?.passwordHash ?? "$2b$12$invalidhashfortimingattack12345";
    const passwordMatch = await bcrypt.compare(password, hash);

    if (!user || !passwordMatch) {
      return Response.json(
        { error: "E-mail ou senha incorretos", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    const workspace = await prisma.workspace.findFirst({
      where: { members: { some: { userId: user.id } } },
      select: { id: true, name: true, slug: true },
    });

    await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
    });

    const { passwordHash: _, ...safeUser } = user;

    return Response.json({
      data: { user: safeUser, workspace },
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return Response.json(
      { error: "Erro interno do servidor", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
