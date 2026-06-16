// Changed: getSession now returns typed SessionData with flat workspaceId
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { env } from "./env";
import crypto from "crypto";

const SESSION_COOKIE = "webway_session";
const SESSION_EXPIRY_MS = env.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  workspaceId: string;
}

export interface SessionData {
  id: string;
  token: string;
  expiresAt: Date;
  user: SessionUser;
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: string,
  options?: { userAgent?: string; ipAddress?: string }
) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      userAgent: options?.userAgent,
      ipAddress: options?.ipAddress,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return session;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
          workspaceMembers: {
            take: 1,
            select: { workspaceId: true },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }
    const cs2 = await cookies();
    cs2.delete(SESSION_COOKIE);
    return null;
  }

  const { workspaceMembers, ...userFields } = session.user;
  const workspaceId = workspaceMembers[0]?.workspaceId ?? "";

  return {
    id: session.id,
    token: session.token,
    expiresAt: session.expiresAt,
    user: { ...userFields, workspaceId },
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    const err = Object.assign(new Error("Não autenticado."), { code: "UNAUTHORIZED", status: 401 });
    throw err;
  }
  return session;
}
