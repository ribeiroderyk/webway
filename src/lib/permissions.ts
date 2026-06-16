// Changed: requireSiteAccess now takes (siteId, workspaceId) matching how routes call it;
//          handleApiError handles plain Error objects with .code/.status shape
import { prisma } from "./prisma";

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message?: string
  ) {
    super(message ?? code);
  }
}

export function apiError(code: string, status: number, message?: string): never {
  throw new ApiError(code, status, message);
}

export async function requireSiteAccess(siteId: string, workspaceId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { id: true, workspaceId: true, name: true, slug: true, status: true, primaryColor: true },
  });

  if (!site) apiError("NOT_FOUND", 404, "Site não encontrado.");
  if (site!.workspaceId !== workspaceId) apiError("FORBIDDEN", 403, "Sem acesso a este site.");

  return site!;
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  // Handle plain Error objects enriched with code/status (e.g., requireAuth throws)
  if (error instanceof Error) {
    const enriched = error as Error & { code?: string; status?: number };
    if (enriched.code === "UNAUTHORIZED") {
      return Response.json({ error: "Não autenticado.", code: "UNAUTHORIZED" }, { status: 401 });
    }
  }

  console.error("Erro interno:", error);
  return Response.json(
    { error: "Erro interno do servidor.", code: "INTERNAL_ERROR" },
    { status: 500 }
  );
}
