"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PAGE_TEMPLATES } from "@/lib/templates";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function NewPagePage() {
  const router = useRouter();
  const { siteId } = useParams<{ siteId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!slugTouched) setSlug(slugify(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, template: selectedTemplate === "blank" ? undefined : selectedTemplate }),
      });
      const json = await res.json() as { data?: { id: string }; error?: string };
      if (!res.ok) { setError(json.error ?? "Erro ao criar página."); return; }
      router.push(`/app/sites/${siteId}/pages/${json.data!.id}/editor`);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "860px" }}>
      <Link
        href={`/app/sites/${siteId}/pages`}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "24px", fontSize: "0.9375rem" }}
      >
        <ArrowLeft size={16} /> Voltar para Páginas
      </Link>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Nova página</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "0.9375rem" }}>
        Escolha um template para começar mais rápido ou crie do zero.
      </p>

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "12px 14px", fontSize: "0.875rem", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        {/* Template picker */}
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "12px" }}>
            Template
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
            {PAGE_TEMPLATES.map((tpl) => {
              const active = selectedTemplate === tpl.key;
              return (
                <button
                  key={tpl.key}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.key)}
                  style={{
                    position: "relative",
                    padding: "16px 12px",
                    border: `2px solid ${active ? "#6366f1" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    backgroundColor: active ? "#eef2ff" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 150ms, background-color 150ms",
                  }}
                >
                  {active && (
                    <span style={{
                      position: "absolute", top: "8px", right: "8px",
                      width: "18px", height: "18px", borderRadius: "50%",
                      backgroundColor: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={11} color="white" />
                    </span>
                  )}
                  <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "8px" }}>{tpl.emoji}</span>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: active ? "#4338ca" : "#0f172a", marginBottom: "4px" }}>
                    {tpl.label}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>
                    {tpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title + slug */}
        <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={labelStyle}>Título da página *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="Sobre nós"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Slug *{" "}
              <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                — /s/site/<strong>{slug || "sobre-nos"}</strong>
              </span>
            </label>
            <input
              type="text"
              value={slug}
              required
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
              placeholder="sobre-nos"
              style={inputStyle}
            />
            <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "4px" }}>
              Use "/" para a página inicial. Apenas letras minúsculas, números e hífens.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: "11px", backgroundColor: "#6366f1", color: "white",
                fontWeight: 600, fontSize: "0.9375rem", border: "none", borderRadius: "8px",
                opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Criando…" : "Criar e abrir editor"}
            </button>
            <Link
              href={`/app/sites/${siteId}/pages`}
              style={{
                padding: "11px 20px", border: "1px solid #e2e8f0", borderRadius: "8px",
                color: "#334155", fontWeight: 500, textDecoration: "none",
                fontSize: "0.9375rem", textAlign: "center",
              }}
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid #d1d5db",
  borderRadius: "8px", fontSize: "0.9375rem", color: "#0f172a",
  outline: "none", boxSizing: "border-box", backgroundColor: "white",
};
