"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";

interface NavPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  showInNav: boolean;
  navOrder: number;
}

export default function NavigationPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [pages, setPages] = useState<NavPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/sites/${siteId}/pages?perPage=200`);
    const json = await res.json() as { data: { pages: NavPage[] } };
    const sorted = (json.data.pages ?? [])
      .filter((p) => p.slug !== "/")
      .sort((a, b) => a.navOrder - b.navOrder || a.title.localeCompare(b.title));
    setPages(sorted);
    setLoading(false);
  }, [siteId]);

  useEffect(() => { void load(); }, [load]);

  async function patchSingle(pageId: string, patch: Partial<NavPage>) {
    return fetch(`/api/sites/${siteId}/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function toggleNav(page: NavPage) {
    setSaving(page.id);
    await patchSingle(page.id, { showInNav: !page.showInNav });
    await load();
    setSaving(null);
  }

  async function moveUp(page: NavPage) {
    const idx = pages.findIndex((p) => p.id === page.id);
    if (idx <= 0) return;
    const prev = pages[idx - 1]!;
    setSaving(page.id);
    await Promise.all([
      patchSingle(page.id, { navOrder: prev.navOrder }),
      patchSingle(prev.id, { navOrder: page.navOrder }),
    ]);
    await load();
    setSaving(null);
  }

  async function moveDown(page: NavPage) {
    const idx = pages.findIndex((p) => p.id === page.id);
    if (idx >= pages.length - 1) return;
    const next = pages[idx + 1]!;
    setSaving(page.id);
    await Promise.all([
      patchSingle(page.id, { navOrder: next.navOrder }),
      patchSingle(next.id, { navOrder: page.navOrder }),
    ]);
    await load();
    setSaving(null);
  }

  const navPages = pages.filter((p) => p.showInNav);
  const hiddenPages = pages.filter((p) => !p.showInNav);

  if (loading) return <div style={{ color: "#94a3b8", padding: "32px" }}>Carregando…</div>;

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Navegação</h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>
          Escolha quais páginas aparecem no menu do site público e defina a ordem.
        </p>
      </div>

      {pages.length === 0 && (
        <div style={{ backgroundColor: "white", border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "48px 24px", textAlign: "center", color: "#64748b" }}>
          Nenhuma página criada ainda. Crie páginas para gerenciar a navegação.
        </div>
      )}

      {/* Nav pages */}
      {navPages.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            No menu ({navPages.length})
          </p>
          <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
            {navPages.map((page, idx) => (
              <div
                key={page.id}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px",
                  borderBottom: idx < navPages.length - 1 ? "1px solid #f1f5f9" : "none",
                  opacity: saving === page.id ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {/* Order */}
                <span style={{ fontSize: "0.8125rem", color: "#94a3b8", width: "20px", textAlign: "center", flexShrink: 0 }}>
                  {idx + 1}
                </span>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#0f172a" }}>{page.title}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>/{page.slug}</p>
                </div>

                {/* Status dot */}
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: page.status === "PUBLISHED" ? "#22c55e" : "#f59e0b",
                }} title={page.status === "PUBLISHED" ? "Publicada" : "Rascunho"} />

                {/* Move up/down */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <button
                    onClick={() => { void moveUp(page); }}
                    disabled={idx === 0 || saving !== null}
                    title="Mover para cima"
                    style={{ border: "none", background: "none", cursor: idx === 0 ? "not-allowed" : "pointer", color: idx === 0 ? "#e2e8f0" : "#64748b", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => { void moveDown(page); }}
                    disabled={idx === navPages.length - 1 || saving !== null}
                    title="Mover para baixo"
                    style={{ border: "none", background: "none", cursor: idx === navPages.length - 1 ? "not-allowed" : "pointer", color: idx === navPages.length - 1 ? "#e2e8f0" : "#64748b", padding: "2px", display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Hide from nav */}
                <button
                  onClick={() => { void toggleNav(page); }}
                  disabled={saving !== null}
                  title="Remover do menu"
                  style={{ border: "1px solid #bbf7d0", borderRadius: "8px", backgroundColor: "#f0fdf4", color: "#16a34a", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer" }}
                >
                  <Eye size={14} /> Visível
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden pages */}
      {hiddenPages.length > 0 && (
        <div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Ocultas do menu ({hiddenPages.length})
          </p>
          <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
            {hiddenPages.map((page, idx) => (
              <div
                key={page.id}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px",
                  borderBottom: idx < hiddenPages.length - 1 ? "1px solid #f1f5f9" : "none",
                  opacity: saving === page.id ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#64748b" }}>{page.title}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "2px" }}>/{page.slug}</p>
                </div>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: page.status === "PUBLISHED" ? "#22c55e" : "#f59e0b",
                }} />
                <button
                  onClick={() => { void toggleNav(page); }}
                  disabled={saving !== null}
                  title="Adicionar ao menu"
                  style={{ border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", color: "#64748b", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer" }}
                >
                  <EyeOff size={14} /> Oculta
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info note */}
      {pages.length > 0 && (
        <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "20px" }}>
          A página inicial (/) aparece automaticamente no logotipo e não é listada aqui.
          O link do Blog aparece automaticamente quando há posts publicados.
        </p>
      )}
    </div>
  );
}
