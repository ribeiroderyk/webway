import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listSites } from "@/server/services/siteService";
import type { Metadata } from "next";
import { Plus, Globe, ExternalLink, Settings } from "lucide-react";

export const metadata: Metadata = { title: "Sites" };

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "#22c55e",
  DRAFT: "#f59e0b",
  ARCHIVED: "#94a3b8",
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Rascunho",
  ARCHIVED: "Arquivado",
};

export default async function SitesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { sites } = await listSites({ workspaceId: session.user.workspaceId, page: 1, perPage: 50 });

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Meus Sites</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>Gerencie todos os seus sites em um só lugar.</p>
        </div>
        <Link
          href="/app/sites/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            borderRadius: "10px",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.9375rem",
            flexShrink: 0,
          }}
        >
          <Plus size={16} /> Novo site
        </Link>
      </div>

      {/* Empty state */}
      {sites.length === 0 && (
        <div
          style={{
            backgroundColor: "white",
            border: "2px dashed #e2e8f0",
            borderRadius: "16px",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#ede9fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Globe size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
            Nenhum site criado ainda
          </h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Crie seu primeiro site e comece a publicar conteúdo em minutos.
          </p>
          <Link
            href="/app/sites/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              backgroundColor: "#6366f1",
              color: "white",
              borderRadius: "10px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <Plus size={16} /> Criar primeiro site
          </Link>
        </div>
      )}

      {/* Site grid */}
      {sites.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {sites.map((site) => (
            <div
              key={site.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Favicon placeholder */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: site.primaryColor + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: site.primaryColor,
                      flexShrink: 0,
                    }}
                  >
                    {site.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>{site.name}</h2>
                    <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{site.slug}</p>
                  </div>
                </div>
                {/* Status badge */}
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: STATUS_COLORS[site.status] ?? "#64748b",
                    backgroundColor: (STATUS_COLORS[site.status] ?? "#64748b") + "18",
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    flexShrink: 0,
                  }}
                >
                  {STATUS_LABELS[site.status] ?? site.status}
                </span>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                  {(site as { _count?: { pages: number } })._count?.pages ?? 0} páginas
                </span>
                <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                  {(site as { _count?: { posts: number } })._count?.posts ?? 0} posts
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <Link
                  href={`/app/sites/${site.id}/pages`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "8px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Gerenciar
                </Link>
                {site.status === "PUBLISHED" && (
                  <a
                    href={`/s/${site.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "8px 10px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#64748b",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    title="Ver site"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
                <Link
                  href={`/app/sites/${site.id}/settings`}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#64748b",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  title="Configurações"
                >
                  <Settings size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
