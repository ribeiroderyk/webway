import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/server/services/siteService";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Globe, FileText, PenSquare, Image, Plus, ArrowRight, CheckCircle2, Circle, AlertTriangle, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

function getGreeting(name: string) {
  const hour = new Date().getHours();
  const part = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = name.split(" ")[0];
  return `${part}, ${firstName}!`;
}

function formatRelativeTime(date: Date) {
  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours > -1) return "agora mesmo";
  if (diffHours > -24) return `há ${Math.abs(diffHours)} hora${Math.abs(diffHours) !== 1 ? "s" : ""}`;
  return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(diffDays, "day");
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(session.user.workspaceId),
    prisma.page.findMany({
      where: { site: { workspaceId: session.user.workspaceId } },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: { id: true, title: true, updatedAt: true, site: { select: { name: true, slug: true } } },
    }),
  ]);

  // --- Empty state: new user with no sites ---
  if (stats.totalSites === 0) {
    return (
      <div style={{ maxWidth: "1200px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>
            {getGreeting(session.user.name)}
          </h1>
        </div>

        {/* Welcome card */}
        <div style={{
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "56px 32px",
          textAlign: "center",
          marginBottom: "24px",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            backgroundColor: "#eef2ff", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Globe size={36} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
            Bem-vindo ao Web Way!
          </h2>
          <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "28px", maxWidth: "420px", margin: "0 auto 28px" }}>
            Você ainda não tem nenhum site. Crie o primeiro para começar a publicar conteúdo.
          </p>
          <Link
            href="/app/sites/new"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", backgroundColor: "#6366f1", color: "white",
              borderRadius: "10px", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none",
            }}
          >
            <Plus size={18} /> Criar meu primeiro site
          </Link>
        </div>

        {/* Checklist for new user */}
        <SetupChecklist stats={stats} />
      </div>
    );
  }

  // --- Normal dashboard ---
  const checklist = buildChecklist(stats);
  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Greeting */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>
          {getGreeting(session.user.name)}
        </h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>
          Aqui está um resumo do seu workspace.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard label="Sites" value={stats.totalSites} icon={Globe} color="#6366f1" href="/app/sites" />
        <StatCard label="Páginas" value={stats.totalPages} icon={FileText} color="#06b6d4" href="/app/sites" />
        <StatCard label="Posts" value={stats.totalPosts} icon={PenSquare} color="#8b5cf6" href="/app/sites" />
        <StatCard label="Mídias" value={stats.totalMedia} icon={Image} color="#f59e0b" href="/app/sites" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Setup checklist */}
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>
              Primeiros passos
            </h2>
            <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
              {completedCount}/{checklist.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: "6px", backgroundColor: "#f1f5f9", borderRadius: "999px", marginBottom: "20px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.round((completedCount / checklist.length) * 100)}%`,
              backgroundColor: completedCount === checklist.length ? "#22c55e" : "#6366f1",
              borderRadius: "999px",
              transition: "width 0.3s ease",
            }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {checklist.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {item.done ? (
                  <CheckCircle2 size={20} color="#22c55e" style={{ flexShrink: 0 }} />
                ) : (
                  <Circle size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
                )}
                {item.href && !item.done ? (
                  <Link href={item.href} style={{ fontSize: "0.9375rem", color: "#6366f1", textDecoration: "none" }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: "0.9375rem", color: item.done ? "#94a3b8" : "#334155", textDecoration: item.done ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SEO Health */}
        <SeoHealthCard seoHealth={stats.seoHealth} totalSites={stats.totalSites} />
      </div>

      {/* Recent activity */}
      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginTop: "24px" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a", marginBottom: "16px" }}>
          Atividade recente
        </h2>
        {recentActivity.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: "0.9375rem" }}>Nenhuma atividade ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {recentActivity.map((page) => (
              <div key={page.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#0f172a" }}>{page.title}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{page.site.name}</p>
                </div>
                <span style={{ fontSize: "0.8125rem", color: "#94a3b8", whiteSpace: "nowrap", marginLeft: "16px" }}>
                  {formatRelativeTime(page.updatedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <Link
          href="/app/sites/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", backgroundColor: "#6366f1", color: "white",
            borderRadius: "10px", fontWeight: 500, textDecoration: "none", fontSize: "0.9375rem",
          }}
        >
          <Plus size={16} /> Novo site
        </Link>
        <Link
          href="/app/sites"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", backgroundColor: "white", color: "#334155",
            border: "1px solid #e2e8f0", borderRadius: "10px", fontWeight: 500,
            textDecoration: "none", fontSize: "0.9375rem",
          }}
        >
          Ver sites <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// --- Shared helpers ---

function buildChecklist(stats: Awaited<ReturnType<typeof getDashboardStats>>) {
  return [
    { label: "Criar seu primeiro site", done: stats.totalSites > 0, href: "/app/sites/new" },
    { label: "Adicionar uma página", done: stats.totalPages > 0, href: stats.totalSites > 0 ? undefined : "/app/sites/new" },
    { label: "Publicar uma página", done: stats.publishedPages > 0, href: undefined },
    { label: "Fazer upload de imagem", done: stats.totalMedia > 0, href: undefined },
    { label: "Configurar SEO de uma página", done: stats.hasSeoConfig, href: undefined },
    { label: "Publicar o site", done: stats.publishedSites > 0, href: undefined },
  ];
}

function SetupChecklist({ stats }: { stats: Awaited<ReturnType<typeof getDashboardStats>> }) {
  const checklist = buildChecklist(stats);
  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>Primeiros passos</h2>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>{completedCount}/{checklist.length}</span>
      </div>
      <div style={{ height: "6px", backgroundColor: "#f1f5f9", borderRadius: "999px", marginBottom: "20px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${Math.round((completedCount / checklist.length) * 100)}%`,
          backgroundColor: "#6366f1",
          borderRadius: "999px",
        }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {checklist.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {item.done ? (
              <CheckCircle2 size={20} color="#22c55e" style={{ flexShrink: 0 }} />
            ) : (
              <Circle size={20} color="#cbd5e1" style={{ flexShrink: 0 }} />
            )}
            {item.href && !item.done ? (
              <Link href={item.href} style={{ fontSize: "0.9375rem", color: "#6366f1", textDecoration: "none" }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ fontSize: "0.9375rem", color: item.done ? "#94a3b8" : "#334155", textDecoration: item.done ? "line-through" : "none" }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeoHealthCard({
  seoHealth,
  totalSites,
}: {
  seoHealth: { averageScore: number | null; sitesWithIssues: number };
  totalSites: number;
}) {
  const score = seoHealth.averageScore;
  const scoreColor = score === null ? "#94a3b8" : score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>Saúde SEO</h2>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <TrendingUp size={18} color="#22c55e" />
        </div>
      </div>

      {score === null ? (
        <div style={{ textAlign: "center", padding: "16px 0", color: "#94a3b8" }}>
          <p style={{ fontSize: "0.9375rem" }}>Nenhuma auditoria SEO executada ainda.</p>
          <p style={{ fontSize: "0.8125rem", marginTop: "4px" }}>
            Acesse SEO → Executar auditoria para ver o score.
          </p>
        </div>
      ) : (
        <>
          {/* Score circle */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              border: `4px solid ${scoreColor}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: scoreColor }}>{score}</span>
            </div>
            <div>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#0f172a" }}>
                Score médio
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>
                {score >= 80 ? "Ótimo! Continue assim." : score >= 60 ? "Pode melhorar." : "Atenção necessária."}
              </p>
            </div>
          </div>

          {seoHealth.sitesWithIssues > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 12px", backgroundColor: "#fffbeb",
              border: "1px solid #fde68a", borderRadius: "8px",
              fontSize: "0.875rem", color: "#92400e", marginBottom: "16px",
            }}>
              <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
              {seoHealth.sitesWithIssues} site{seoHealth.sitesWithIssues !== 1 ? "s" : ""} com problemas críticos
            </div>
          )}
        </>
      )}

      <Link
        href="/app/sites"
        style={{ fontSize: "0.875rem", color: "#6366f1", textDecoration: "none", fontWeight: 500 }}
      >
        Ver auditoria SEO →
      </Link>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{
        backgroundColor: "white", border: "1px solid #e2e8f0",
        borderRadius: "16px", padding: "20px",
        display: "flex", alignItems: "center", gap: "16px",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          backgroundColor: `${color}18`, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={22} color={color} />
        </div>
        <div>
          <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{value}</p>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "2px" }}>{label}</p>
        </div>
      </div>
    </Link>
  );
}
