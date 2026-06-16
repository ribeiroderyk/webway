"use client";

import { useState, useEffect } from "react";

interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

export default function WorkspacePage() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setWorkspace(json.data);
          setName(json.data.name);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: json.error ?? "Erro ao salvar." }); return; }
      setWorkspace(json.data);
      setMessage({ type: "success", text: "Workspace atualizado!" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#94a3b8" }}>Carregando…</div>;
  if (!workspace) return null;

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Workspace</h1>
      </div>

      {message && (
        <div style={{
          backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          color: message.type === "success" ? "#16a34a" : "#dc2626",
          borderRadius: "8px",
          padding: "10px 14px",
          fontSize: "0.875rem",
          marginBottom: "20px",
        }}>
          {message.text}
        </div>
      )}

      {/* Workspace info */}
      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>Informações do workspace</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Nome do workspace</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input type="text" defaultValue={workspace.slug} disabled style={{ ...inputStyle, backgroundColor: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: "9px 24px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.9375rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      {/* Plan info */}
      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "16px" }}>Plano atual</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: "1.125rem", color: "#6366f1" }}>
              {workspace.plan === "FREE" ? "Free" : workspace.plan}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "4px" }}>
              {workspace.plan === "FREE"
                ? "Inclui até 3 sites, 10 páginas por site, 100 MB de armazenamento."
                : "Plano avançado com recursos ilimitados."}
            </p>
          </div>
          <button
            disabled
            style={{ padding: "9px 20px", backgroundColor: "#f1f5f9", color: "#94a3b8", border: "none", borderRadius: "8px", fontWeight: 500, fontSize: "0.875rem", cursor: "not-allowed" }}
            title="Em breve"
          >
            Fazer upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};
