"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function NewSitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setSlug(slugify(e.target.value));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          slug: data.get("slug"),
          description: data.get("description") || undefined,
          language: data.get("language"),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Erro ao criar site. Tente novamente.");
        return;
      }

      router.push(`/app/sites/${json.data.id}/pages`);
    } catch {
      setError("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <Link
        href="/app/sites"
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "24px", fontSize: "0.9375rem" }}
      >
        <ArrowLeft size={16} /> Voltar para Sites
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Novo site</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Configure as informações básicas do seu novo site.</p>

      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px" }}>
        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "0.875rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="name" style={labelStyle}>Nome do site *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Meu Site Incrível"
              onChange={handleNameChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="slug" style={labelStyle}>
              Slug (URL) *{" "}
              <span style={{ color: "#94a3b8", fontWeight: 400 }}>— webway.app/s/<strong>{slug || "meu-site"}</strong></span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              pattern="[a-z0-9-]+"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="meu-site"
              style={inputStyle}
            />
            <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "4px" }}>
              Apenas letras minúsculas, números e hífens.
            </p>
          </div>

          <div>
            <label htmlFor="description" style={labelStyle}>Descrição (opcional)</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Uma breve descrição do seu site para SEO…"
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          <div>
            <label htmlFor="language" style={labelStyle}>Idioma principal</label>
            <select id="language" name="language" defaultValue="pt-BR" style={inputStyle}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "11px",
                backgroundColor: "#6366f1",
                color: "white",
                fontWeight: 600,
                fontSize: "0.9375rem",
                border: "none",
                borderRadius: "8px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Criando…" : "Criar site"}
            </button>
            <Link
              href="/app/sites"
              style={{
                padding: "11px 20px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#334155",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "0.9375rem",
                textAlign: "center",
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
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
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};
