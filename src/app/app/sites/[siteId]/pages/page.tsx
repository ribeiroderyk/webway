"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, FileText, Pencil, Eye, Globe, EyeOff } from "lucide-react";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  seoScore: number | null;
  updatedAt: string;
}

interface SiteInfo {
  name: string;
  slug: string;
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  PUBLISHED: { label: "Publicada", color: "#166534", bg: "#dcfce7" },
  DRAFT: { label: "Rascunho", color: "#92400e", bg: "#fef3c7" },
};

export default function PagesListPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [pages, setPages] = useState<Page[]>([]);
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [pagesRes, siteRes] = await Promise.all([
      fetch(`/api/sites/${siteId}/pages`),
      fetch(`/api/sites/${siteId}`),
    ]);
    const pagesJson = await pagesRes.json() as { data: { pages: Page[] } };
    const siteJson = await siteRes.json() as { data: SiteInfo };
    setPages(pagesJson.data.pages);
    setSite(siteJson.data);
    setLoading(false);
  }, [siteId]);

  useEffect(() => { void load(); }, [load]);

  async function togglePublish(page: Page) {
    setToggling(page.id);
    const endpoint = page.status === "PUBLISHED"
      ? `/api/sites/${siteId}/pages/${page.id}/publish`
      : `/api/sites/${siteId}/pages/${page.id}/publish`;
    const method = page.status === "PUBLISHED" ? "DELETE" : "POST";
    await fetch(endpoint, { method });
    await load();
    setToggling(null);
  }

  if (loading) return <div style={{ color: "#94a3b8", padding: "32px" }}>Carregando…</div>;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Páginas</h1>
          {site && <p style={{ color: "#64748b", marginTop: "4px" }}>{site.name}</p>}
        </div>
        <Link
          href={`/app/sites/${siteId}/pages/new`}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", backgroundColor: "#6366f1", color: "white",
            borderRadius: "10px", fontWeight: 500, textDecoration: "none", fontSize: "0.9375rem",
          }}
        >
          <Plus size={16} /> Nova página
        </Link>
      </div>

      {/* Empty state */}
      {pages.length === 0 && (
        <div style={{ backgroundColor: "white", border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <FileText size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Nenhuma página ainda</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>Crie páginas para o seu site com o editor visual de blocos.</p>
          <Link
            href={`/app/sites/${siteId}/pages/new`}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#6366f1", color: "white", borderRadius: "10px", fontWeight: 500, textDecoration: "none" }}
          >
            <Plus size={16} /> Criar primeira página
          </Link>
        </div>
      )}

      {/* Table */}
      {pages.length > 0 && (
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={thStyle}>Título</th>
                <th style={thStyle}>Slug</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>SEO</th>
                <th style={thStyle}>Atualizado</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const badge = STATUS_BADGE[page.status] ?? { label: "Rascunho", color: "#92400e", bg: "#fef3c7" };
                const isToggling = toggling === page.id;

                return (
                  <tr key={page.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      <Link
                        href={`/app/sites/${siteId}/pages/${page.id}/editor`}
                        style={{ fontWeight: 500, color: "#0f172a", textDecoration: "none", fontSize: "0.9375rem" }}
                      >
                        {page.title}
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      <code style={{ fontSize: "0.8125rem", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569" }}>
                        {page.slug}
                      </code>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 500, color: badge.color, backgroundColor: badge.bg, padding: "3px 8px", borderRadius: "9999px" }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {page.seoScore !== null ? (
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: page.seoScore >= 80 ? "#22c55e" : page.seoScore >= 50 ? "#f59e0b" : "#ef4444" }}>
                          {page.seoScore}%
                        </span>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.875rem" }}>
                      {new Intl.DateTimeFormat("pt-BR").format(new Date(page.updatedAt))}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        {/* Publish toggle */}
                        <button
                          onClick={() => { void togglePublish(page); }}
                          disabled={isToggling}
                          title={page.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                          style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "32px", height: "32px", borderRadius: "8px",
                            border: `1px solid ${page.status === "PUBLISHED" ? "#bbf7d0" : "#e2e8f0"}`,
                            backgroundColor: page.status === "PUBLISHED" ? "#f0fdf4" : "white",
                            color: page.status === "PUBLISHED" ? "#16a34a" : "#64748b",
                            cursor: isToggling ? "not-allowed" : "pointer",
                            opacity: isToggling ? 0.5 : 1,
                          }}
                        >
                          {page.status === "PUBLISHED" ? <EyeOff size={15} /> : <Globe size={15} />}
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/app/sites/${siteId}/pages/${page.id}/editor`}
                          title="Editar"
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#64748b", textDecoration: "none" }}
                        >
                          <Pencil size={15} />
                        </Link>

                        {/* View published */}
                        {page.status === "PUBLISHED" && site && (
                          <Link
                            href={`/s/${site.slug}/${page.slug === "/" ? "" : page.slug}`}
                            title="Ver"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#64748b", textDecoration: "none" }}
                          >
                            <Eye size={15} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontSize: "0.8125rem",
  fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em",
};

const tdStyle: React.CSSProperties = { padding: "14px 16px", verticalAlign: "middle" };
