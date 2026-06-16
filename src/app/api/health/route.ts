import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();
  let databaseStatus = "ok";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    databaseStatus = "error";
  }

  const status = databaseStatus === "ok" ? "ok" : "degraded";

  return Response.json(
    {
      status,
      version: process.env.npm_package_version ?? "0.1.0",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${Date.now() - start}ms`,
      services: {
        database: databaseStatus,
        storage: "ok",
      },
    },
    { status: status === "ok" ? 200 : 503 }
  );
}
