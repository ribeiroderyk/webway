import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { prisma } from "@/lib/prisma";
import { auditPageSeo } from "@/lib/seo";
import type { Metadata } from "next";
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface Props {
  params: Promise<{ siteId: string }>;
}

export const metadata: Metadata = { title: "SEO" };

export default async function SeoPage({ params }: Props) {
  const { siteId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) notFound();

  const pages = await prisma.page.findMany({
    where: { siteId },
    select: {
      id: true, title: true, slug: true, status: true,
      seoTitle: true, seoDescription: true, blocks: true,
      seoScore: true, robotsIndex: true, updatedAt: true,
      ogTitle: true, ogImageUrl: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Run live audit for pages without a cached score
  const audited = pages.map((page) => {
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    const audit = auditPageSeo(page, blocks as unknown as Parameters<typeof auditPageSeo>[1]);
    return { ...page, liveScore: audit.score, checks: audit.checks };
  });

  const avgScore = audited.length
    ? Math.round(audited.reduce((s, p) => s + p.liveScore, 0) / audited.length)
    : null;

  const issues = audited.flatMap((p) =>
    p.checks.filter((c) => !c.passed).map((c) => ({ page: p.title, slug: p.slug, check: c.label, points: c.points }))
  );

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>SEO</h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>{site.name}</p>
      </div>

      {/* Overview cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <ScoreCard label="Score médio" score={avgScore} />
        <StatCard label="Páginas auditadas" value={pages.length} />
        <StatCard label="Problemas detectados" value={issues.length} danger={issues.length > 0} />
        <StatCard label="Páginas publicadas" value={pages.filter((p) => p.status === "PUBLISHED").length} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Page-by-page audit table */}
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>Auditoria por página</h2>
          </div>
          {audited.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              Nenhuma página criada ainda.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={thStyle}>Página</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {audited.map((page) => (
                  <tr key={page.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 500, color: "#0f172a", fontSize: "0.9375rem" }}>{page.title}</p>
                      <code style={{ fontSize: "0.75rem", color: "#64748b" }}>{page.slug}</code>
                    </td>
                    <td style={tdStyle}>
                      <ScorePill score={page.liveScore} />
                    </td>
                    <td style={tdStyle}>
                      <StatusDot status={page.status} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <Link
                        href={`/app/sites/${siteId}/pages/${page.id}/editor`}
                        style={{ fontSize: "0.8125rem", color: "#6366f1", textDecoration: "none" }}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Issues list */}
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>Problemas detectados</h2>
          </div>
          {issues.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <CheckCircle2 size={32} color="#22c55e" style={{ margin: "0 auto 8px" }} />
              <p style={{ color: "#16a34a", fontWeight: 500 }}>Nenhum problema encontrado!</p>
            </div>
          ) : (
            <div style={{ padding: "8px" }}>
              {issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "8px" }}>
                  <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "#0f172a", fontWeight: 500 }}>{issue.check}</p>
                    <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{issue.page} · -{issue.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sitemap & robots info */}
      <div style={{ marginTop: "24px", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "16px" }}>Arquivos técnicos</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <TechFileLink
            label="sitemap.xml"
            href={`/s/${site.slug}/sitemap.xml`}
            description="Mapa do site para indexação"
          />
          <TechFileLink
            label="robots.txt"
            href="/robots.txt"
            description="Regras para bots de busca"
          />
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  const color = score === null ? "#94a3b8" : score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
      <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "2.5rem", fontWeight: 700, color, lineHeight: 1 }}>
        {score !== null ? score : "—"}
      </p>
      {score !== null && <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>de 100</p>}
    </div>
  );
}

function StatCard({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
      <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "2rem", fontWeight: 700, color: danger && value > 0 ? "#ef4444" : "#0f172a" }}>{value}</p>
    </div>
  );
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const bg = score >= 80 ? "#dcfce7" : score >= 50 ? "#fef3c7" : "#fef2f2";
  return (
    <span style={{ fontSize: "0.8125rem", fontWeight: 700, color, backgroundColor: bg, padding: "2px 8px", borderRadius: "9999px" }}>
      {score}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { PUBLISHED: "#22c55e", DRAFT: "#f59e0b", ARCHIVED: "#94a3b8" };
  const labels: Record<string, string> = { PUBLISHED: "Pub.", DRAFT: "Rascunho", ARCHIVED: "Arq." };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8125rem", color: colors[status] ?? "#94a3b8" }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: colors[status] ?? "#94a3b8" }} />
      {labels[status] ?? status}
    </span>
  );
}

function TechFileLink({ label, href, description }: { label: string; href: string; description: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        textDecoration: "none",
        color: "#334155",
      }}
    >
      <div>
        <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{label}</p>
        <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{description}</p>
      </div>
      <ExternalLink size={14} color="#94a3b8" />
    </a>
  );
}

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  verticalAlign: "middle",
};
