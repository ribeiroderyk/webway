"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Trash2, ArrowRight, ExternalLink } from "lucide-react";

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  createdAt: string;
}

export default function RedirectsPage() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;

  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRedirects = useCallback(async () => {
    const res = await fetch(`/api/sites/${siteId}/redirects`);
    const data = await res.json() as { redirects: Redirect[] };
    setRedirects(data.redirects);
    setLoading(false);
  }, [siteId]);

  useEffect(() => { void loadRedirects(); }, [loadRedirects]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch(`/api/sites/${siteId}/redirects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromPath: from, toPath: to, statusCode }),
    });
    setSaving(false);
    if (res.ok) {
      setFrom(""); setTo(""); setStatusCode(301); setShowForm(false);
      void loadRedirects();
    } else {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Erro ao criar redirect");
    }
  }

  async function handleDelete(redirectId: string) {
    if (!confirm("Remover este redirect?")) return;
    await fetch(`/api/sites/${siteId}/redirects/${redirectId}`, { method: "DELETE" });
    void loadRedirects();
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>Redirecionamentos</h1>
          <p style={{ color: "#64748b", fontSize: "0.9375rem", marginTop: "4px" }}>
            Configure redirects 301/302 para URLs antigas do seu site.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", backgroundColor: "#6366f1", color: "white",
            borderRadius: "10px", fontWeight: 600, fontSize: "0.9375rem", border: "none", cursor: "pointer",
          }}
        >
          <Plus size={16} /> Adicionar redirect
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          backgroundColor: "white", border: "1px solid #e2e8f0",
          borderRadius: "16px", padding: "24px", marginBottom: "24px",
        }}>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>
            Novo redirect
          </h2>
          {error && (
            <div style={{ padding: "10px 14px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", fontSize: "0.875rem", marginBottom: "16px" }}>
              {error}
            </div>
          )}
          <form onSubmit={(e) => { void handleCreate(e); }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: "12px", alignItems: "end", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                  De (caminho antigo)
                </label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="/pagina-antiga"
                  required
                  style={{
                    width: "100%", padding: "9px 12px", border: "1px solid #d1d5db",
                    borderRadius: "8px", fontSize: "0.9375rem", color: "#0f172a", boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ paddingBottom: "8px", color: "#94a3b8" }}>
                <ArrowRight size={18} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                  Para (destino)
                </label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="/nova-pagina ou https://..."
                  required
                  style={{
                    width: "100%", padding: "9px 12px", border: "1px solid #d1d5db",
                    borderRadius: "8px", fontSize: "0.9375rem", color: "#0f172a", boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                  Tipo
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)}
                  style={{
                    padding: "9px 12px", border: "1px solid #d1d5db",
                    borderRadius: "8px", fontSize: "0.9375rem", color: "#0f172a", backgroundColor: "white",
                  }}
                >
                  <option value={301}>301 — Permanente</option>
                  <option value={302}>302 — Temporário</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                style={{ padding: "9px 18px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.9375rem", backgroundColor: "white", color: "#64748b", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "9px 18px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Salvando..." : "Salvar redirect"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>Carregando...</div>
        ) : redirects.length === 0 ? (
          <div style={{ padding: "64px 24px", textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ExternalLink size={22} color="#94a3b8" />
            </div>
            <p style={{ fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>Nenhum redirect configurado</p>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              Redirects evitam que visitantes caiam em URLs inexistentes.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "#64748b" }}>De</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.8125rem", fontWeight: 600, color: "#64748b" }}>Para</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "0.8125rem", fontWeight: 600, color: "#64748b" }}>Tipo</th>
                <th style={{ padding: "12px 16px", width: "60px" }} />
              </tr>
            </thead>
            <tbody>
              {redirects.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <code style={{ fontSize: "0.875rem", color: "#0f172a", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                      {r.fromPath}
                    </code>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "0.875rem", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                      <ArrowRight size={14} color="#94a3b8" />
                      <code style={{ fontSize: "0.875rem", color: "#6366f1", backgroundColor: "#eef2ff", padding: "2px 8px", borderRadius: "4px" }}>
                        {r.toPath}
                      </code>
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px",
                      backgroundColor: r.statusCode === 301 ? "#dcfce7" : "#fef9c3",
                      color: r.statusCode === 301 ? "#166534" : "#854d0e",
                    }}>
                      {r.statusCode}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <button
                      onClick={() => { void handleDelete(r.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px", borderRadius: "6px", display: "inline-flex" }}
                      title="Remover redirect"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {redirects.length > 0 && (
        <p style={{ marginTop: "12px", fontSize: "0.8125rem", color: "#94a3b8" }}>
          {redirects.length} redirect{redirects.length !== 1 ? "s" : ""} configurado{redirects.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
