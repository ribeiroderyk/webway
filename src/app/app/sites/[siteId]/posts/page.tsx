import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { listPosts } from "@/server/services/postService";
import type { Metadata } from "next";
import { Plus, PenSquare, Pencil, Eye } from "lucide-react";

interface Props {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = { title: "Blog" };

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  PUBLISHED: { label: "Publicado", color: "#166534", bg: "#dcfce7" },
  DRAFT: { label: "Rascunho", color: "#92400e", bg: "#fef3c7" },
  ARCHIVED: { label: "Arquivado", color: "#475569", bg: "#f1f5f9" },
};

export default async function PostsListPage({ params, searchParams }: Props) {
  const { siteId } = await params;
  const { page: pageParam } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");

  const site = await getSiteById(siteId, session.user.workspaceId);
  if (!site) notFound();

  const page = Number(pageParam ?? 1);
  const { posts, total } = await listPosts(siteId, { page, perPage: 20 });
  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Blog</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>{site.name}</p>
        </div>
        <Link
          href={`/app/sites/${siteId}/posts/new`}
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
          }}
        >
          <Plus size={16} /> Novo post
        </Link>
      </div>

      {/* Empty state */}
      {posts.length === 0 && (
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
            <PenSquare size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
            Nenhum post ainda
          </h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Comece a escrever e publique conteúdo para o seu blog.
          </p>
          <Link
            href={`/app/sites/${siteId}/posts/new`}
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
            <Plus size={16} /> Criar primeiro post
          </Link>
        </div>
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
                  return (
                    <tr key={post.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={tdStyle}>
                        <Link
                          href={`/app/sites/${siteId}/posts/${post.id}`}
                          style={{ fontWeight: 500, color: "#0f172a", textDecoration: "none", fontSize: "0.9375rem" }}
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>
                            {post.excerpt.slice(0, 80)}…
                          </p>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: badge.color, backgroundColor: badge.bg, padding: "3px 8px", borderRadius: "9999px" }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.875rem" }}>
                        {post.author.name}
                      </td>
                      <td style={{ ...tdStyle, color: "#64748b", fontSize: "0.875rem" }}>
                        {post.publishedAt
                          ? new Intl.DateTimeFormat("pt-BR").format(post.publishedAt)
                          : "—"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <Link
                            href={`/app/sites/${siteId}/posts/${post.id}`}
                            title="Editar"
                            style={actionBtnStyle}
                          >
                            <Pencil size={15} />
                          </Link>
                          {post.status === "PUBLISHED" && (
                            <a
                              href={`/s/${site.slug}/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver post"
                              style={actionBtnStyle}
                            >
                              <Eye size={15} />
                            </a>
                          )}
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
                <Link
                  key={p}
                  href={`/app/sites/${siteId}/posts?page=${p}`}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: p === page ? "#6366f1" : "white",
                    color: p === page ? "white" : "#334155",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  verticalAlign: "middle",
};

const actionBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  color: "#64748b",
  textDecoration: "none",
};
