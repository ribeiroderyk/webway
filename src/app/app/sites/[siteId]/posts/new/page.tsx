"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function NewPostPage() {
  const router = useRouter();
  const { siteId } = useParams<{ siteId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) setSlug(slugify(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/sites/${siteId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          slug: data.get("slug"),
          excerpt: data.get("excerpt") || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Erro ao criar post.");
        return;
      }

      router.push(`/app/sites/${siteId}/posts/${json.data.id}`);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <Link
        href={`/app/sites/${siteId}/posts`}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", marginBottom: "24px", fontSize: "0.9375rem" }}
      >
        <ArrowLeft size={16} /> Voltar para Blog
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Novo post</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Crie um novo post para o seu blog.</p>

      <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px" }}>
        {error && (
          <div role="alert" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "8px", padding: "12px 14px", fontSize: "0.875rem", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="title" style={labelStyle}>Título *</label>
            <input id="title" name="title" type="text" required placeholder="Meu primeiro post" onChange={handleTitleChange} style={inputStyle} />
          </div>

          <div>
            <label htmlFor="slug" style={labelStyle}>Slug *</label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
              placeholder="meu-primeiro-post"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="excerpt" style={labelStyle}>Resumo (opcional)</label>
            <textarea id="excerpt" name="excerpt" rows={3} placeholder="Breve resumo do post para SEO e listagens…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: "11px", backgroundColor: "#6366f1", color: "white", fontWeight: 600, fontSize: "0.9375rem", border: "none", borderRadius: "8px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Criando…" : "Criar post"}
            </button>
            <Link href={`/app/sites/${siteId}/posts`} style={{ padding: "11px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#334155", fontWeight: 500, textDecoration: "none", fontSize: "0.9375rem", textAlign: "center" }}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.9375rem", color: "#0f172a", outline: "none", boxSizing: "border-box", backgroundColor: "white" };
