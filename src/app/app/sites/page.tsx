"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Globe, ExternalLink, Settings, EyeOff, Search, Archive } from "lucide-react";

interface Site {
  id: string;
  name: string;
  slug: string;
  status: string;
  primaryColor: string;
  _count: { pages: number; posts: number };
}

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

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/sites");
    const json = await res.json() as { data: { sites: Site[] } };
    setSites(json.data.sites);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = sites.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleStatus(site: Site) {
    const nextStatus = site.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setToggling(site.id);
    await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await load();
    setToggling(null);
  }

  async function archiveSite(site: Site) {
    if (!confirm(`Arquivar "${site.name}"? O site ficará inacessível ao público.`)) return;
    setToggling(site.id);
    await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });
    await load();
    setToggling(null);
  }

  if (loading) return <div style={{ color: "#94a3b8", padding: "32px" }}>Carregando…</div>;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Meus Sites</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>Gerencie todos os seus sites em um só lugar.</p>
        </div>
        <Link
          href="/app/sites/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", backgroundColor: "#6366f1", color: "white",
            borderRadius: "10px", fontWeight: 500, textDecoration: "none", fontSize: "0.9375rem", flexShrink: 0,
          }}
        >
          <Plus size={16} /> Novo site
        </Link>
      </div>

      {/* Search */}
      {sites.length > 0 && (
        <div style={{ position: "relative", marginBottom: "24px", maxWidth: "360px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar site…"
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              border: "1px solid #e2e8f0", borderRadius: "10px",
              fontSize: "0.9375rem", color: "#0f172a", outline: "none",
              boxSizing: "border-box", backgroundColor: "white",
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {sites.length === 0 && (
        <div style={{ backgroundColor: "white", border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Globe size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Nenhum site criado ainda</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>Crie seu primeiro site e comece a publicar conteúdo em minutos.</p>
          <Link
            href="/app/sites/new"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#6366f1", color: "white", borderRadius: "10px", fontWeight: 500, textDecoration: "none" }}
          >
            <Plus size={16} /> Criar primeiro site
          </Link>
        </div>
      )}

      {/* No search results */}
      {sites.length > 0 && filtered.length === 0 && (
        <p style={{ color: "#94a3b8", fontSize: "0.9375rem", padding: "16px 0" }}>
          Nenhum site encontrado para &ldquo;{search}&rdquo;.
        </p>
      )}

      {/* Site grid */}
      {filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map((site) => {
            const isToggling = toggling === site.id;
            return (
              <div
                key={site.id}
                style={{
                  backgroundColor: "white", border: "1px solid #e2e8f0",
                  borderRadius: "16px", padding: "20px",
                  display: "flex", flexDirection: "column", gap: "12px",
                  opacity: isToggling ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      backgroundColor: site.primaryColor + "20",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.125rem", fontWeight: 700, color: site.primaryColor, flexShrink: 0,
                    }}>
                      {site.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>{site.name}</h2>
                      <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{site.slug}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 500,
                    color: STATUS_COLORS[site.status] ?? "#64748b",
                    backgroundColor: (STATUS_COLORS[site.status] ?? "#64748b") + "18",
                    padding: "3px 8px", borderRadius: "9999px", flexShrink: 0,
                  }}>
                    {STATUS_LABELS[site.status] ?? site.status}
                  </span>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>{site._count?.pages ?? 0} páginas</span>
                  <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>{site._count?.posts ?? 0} posts</span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <Link
                    href={`/app/sites/${site.id}/pages`}
                    style={{ flex: 1, textAlign: "center", padding: "8px", backgroundColor: "#6366f1", color: "white", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}
                  >
                    Gerenciar
                  </Link>

                  {/* Publish / unpublish toggle */}
                  {site.status !== "ARCHIVED" && (
                    <button
                      onClick={() => { void toggleStatus(site); }}
                      disabled={isToggling}
                      title={site.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                      style={{
                        padding: "8px 10px", border: `1px solid ${site.status === "PUBLISHED" ? "#bbf7d0" : "#e2e8f0"}`,
                        borderRadius: "8px", color: site.status === "PUBLISHED" ? "#16a34a" : "#64748b",
                        backgroundColor: site.status === "PUBLISHED" ? "#f0fdf4" : "white",
                        display: "inline-flex", alignItems: "center",
                        cursor: isToggling ? "not-allowed" : "pointer",
                      }}
                    >
                      {site.status === "PUBLISHED" ? <EyeOff size={15} /> : <Globe size={15} />}
                    </button>
                  )}

                  {/* View live */}
                  {site.status === "PUBLISHED" && (
                    <a
                      href={`/s/${site.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", display: "inline-flex", alignItems: "center" }}
                      title="Ver site"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  {/* Settings */}
                  <Link
                    href={`/app/sites/${site.id}/settings`}
                    style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", display: "inline-flex", alignItems: "center" }}
                    title="Configurações"
                  >
                    <Settings size={15} />
                  </Link>

                  {/* Archive */}
                  {site.status !== "ARCHIVED" && (
                    <button
                      onClick={() => { void archiveSite(site); }}
                      disabled={isToggling}
                      title="Arquivar"
                      style={{ padding: "8px 10px", border: "1px solid #fde68a", borderRadius: "8px", color: "#92400e", backgroundColor: "white", display: "inline-flex", alignItems: "center", cursor: isToggling ? "not-allowed" : "pointer" }}
                    >
                      <Archive size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
