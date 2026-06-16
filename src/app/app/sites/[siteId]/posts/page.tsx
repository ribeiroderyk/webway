"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Plus, PenSquare, Pencil, Eye, Globe, EyeOff, Trash2, Search } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  publishedAt: string | null;
  author: { name: string };
}

interface SiteInfo {
  name: string;
  slug: string;
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  PUBLISHED: { label: "Publicado", color: "#166534", bg: "#dcfce7" },
  DRAFT: { label: "Rascunho", color: "#92400e", bg: "#fef3c7" },
};

export default function PostsListPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? 1);

  const [posts, setPosts] = useState<Post[]>([]);
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const perPage = 20;
  const totalPages = Math.ceil(total / perPage);

  const load = useCallback(async (q = "") => {
    const qs = q ? `&search=${encodeURIComponent(q)}` : "";
    const [postsRes, siteRes] = await Promise.all([
      fetch(`/api/sites/${siteId}/posts?page=${page}&perPage=${perPage}${qs}`),
      fetch(`/api/sites/${siteId}`),
    ]);
    const postsJson = await postsRes.json() as { data: { posts: Post[]; total: number } };
    const siteJson = await siteRes.json() as { data: SiteInfo };
    setPosts(postsJson.data.posts);
    setTotal(postsJson.data.total);
    setSite(siteJson.data);
    setLoading(false);
  }, [siteId, page]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => { void load(search); }, 300);
    return () => clearTimeout(t);
  }, [search, load]);

  async function togglePublish(post: Post) {
    setToggling(post.id);
    const method = post.status === "PUBLISHED" ? "DELETE" : "POST";
    await fetch(`/api/sites/${siteId}/posts/${post.id}/publish`, { method });
    await load(search);
    setToggling(null);
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Excluir "${post.title}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(post.id);
    await fetch(`/api/sites/${siteId}/posts/${post.id}`, { method: "DELETE" });
    await load(search);
    setDeleting(null);
  }

  if (loading) return <div style={{ color: "#94a3b8", padding: "32px" }}>Carregando…</div>;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Blog</h1>
          {site && <p style={{ color: "#64748b", marginTop: "4px" }}>{site.name}</p>}
        </div>
        <Link
          href={`/app/sites/${siteId}/posts/new`}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "#6366f1", color: "white", borderRadius: "10px", fontWeight: 500, textDecoration: "none", fontSize: "0.9375rem" }}
        >
          <Plus size={16} /> Novo post
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "360px" }}>
        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar post…"
          style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9375rem", color: "#0f172a", outline: "none", boxSizing: "border-box", backgroundColor: "white" }}
        />
      </div>

      {/* Empty state */}
      {posts.length === 0 && !search && (
        <div style={{ backgroundColor: "white", border: "2px dashed #e2e8f0", borderRadius: "16px", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <PenSquare size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Nenhum post ainda</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>Comece a escrever e publique conteúdo para o seu blog.</p>
          <Link
            href={`/app/sites/${siteId}/posts/new`}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", backgroundColor: "#6366f1", color: "white", borderRadius: "10px", fontWeight: 500, textDecoration: "none" }}
          >
            <Plus size={16} /> Criar primeiro post
          </Link>
        </div>
      )}

      {/* No results */}
      {posts.length === 0 && search && (
        <p style={{ color: "#94a3b8", fontSize: "0.9375rem", padding: "16px 0" }}>
          Nenhum post encontrado para &ldquo;{search}&rdquo;.
        </p>
      )}

      {/* Table */}
      {posts.length > 0 && (
        <>
          <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={thStyle}>Título</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Autor</th>
                  <th style={thStyle}>Publicado em</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const badge = STATUS_BADGE[post.status] ?? { label: "Rascunho", color: "#92400e", bg: "#fef3c7" };
                  const isToggling = toggling === post.id;
                  const isDeleting = deleting === post.id;

                  return (
                    <tr key={post.id} style={{ borderBottom: "1px solid #f1f5f9", opacity: isDeleting ? 0.4 : 1 }}>
                      <td style={tdStyle}>
                        <Link href={`/app/sites/${siteId}/posts/${post.id}`} style={{ fontWeight: 500, color: "#0f172a", textDecoration: "none", fontSize: "0.9375rem" }}>
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>
                            {post.excerpt.slice(0, 80)}{post.excerpt.length > 80 ? "…" : ""}
                          </p>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: badge.color, backgroundColor: badge.bg, padding: "3px 8px", borderRadius: "9999px" }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.875rem" }}>{post.author.name}</td>
                      <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.875rem" }}>
                        {post.publishedAt ? new Intl.DateTimeFormat("pt-BR").format(new Date(post.publishedAt)) : "—"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          {/* Publish toggle */}
                          <button
                            onClick={() => { void togglePublish(post); }}
                            disabled={isToggling}
                            title={post.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                            style={{
                              ...actionBtnStyle,
                              border: `1px solid ${post.status === "PUBLISHED" ? "#bbf7d0" : "#e2e8f0"}`,
                              backgroundColor: post.status === "PUBLISHED" ? "#f0fdf4" : "white",
                              color: post.status === "PUBLISHED" ? "#16a34a" : "#64748b",
                              opacity: isToggling ? 0.5 : 1,
                              cursor: isToggling ? "not-allowed" : "pointer",
                            }}
                          >
                            {post.status === "PUBLISHED" ? <EyeOff size={15} /> : <Globe size={15} />}
                          </button>

                          {/* Edit */}
                          <Link href={`/app/sites/${siteId}/posts/${post.id}`} title="Editar" style={{ ...actionBtnStyle, textDecoration: "none" }}>
                            <Pencil size={15} />
                          </Link>

                          {/* View */}
                          {post.status === "PUBLISHED" && site && (
                            <a href={`/s/${site.slug}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="Ver post" style={{ ...actionBtnStyle, textDecoration: "none" }}>
                              <Eye size={15} />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => { void handleDelete(post); }}
                            disabled={isDeleting}
                            title="Excluir"
                            style={{ ...actionBtnStyle, border: "1px solid #fecaca", color: "#ef4444", backgroundColor: "white", cursor: isDeleting ? "not-allowed" : "pointer" }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => router.push(`/app/sites/${siteId}/posts?page=${p}`)}
                  style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: p === page ? "#6366f1" : "white", color: p === page ? "white" : "#334155", fontSize: "0.875rem", cursor: "pointer" }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left", fontSize: "0.8125rem",
  fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em",
};

const tdStyle: React.CSSProperties = { padding: "14px 16px", verticalAlign: "middle" };

const actionBtnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0",
  color: "#64748b", backgroundColor: "white",
};
