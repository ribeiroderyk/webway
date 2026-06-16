import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildSiteUrl } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ siteSlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getSiteForBlog(siteSlug: string) {
  return prisma.site.findFirst({
    where: { slug: siteSlug, status: "PUBLISHED" },
    select: { id: true, name: true, slug: true, language: true, primaryColor: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug } = await params;
  const site = await getSiteForBlog(siteSlug);
  if (!site) return { title: "Não encontrado" };

  return {
    title: `Blog | ${site.name}`,
    alternates: { canonical: `${buildSiteUrl(siteSlug)}/blog` },
  };
}

export default async function BlogListPage({ params, searchParams }: Props) {
  const { siteSlug } = await params;
  const { page: pageParam } = await searchParams;

  const site = await getSiteForBlog(siteSlug);
  if (!site) notFound();

  const page = Number(pageParam ?? 1);
  const perPage = 9;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { siteId: site.id, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImageUrl: true, publishedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.post.count({ where: { siteId: site.id, status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "48px" }}>Blog</h1>

      {posts.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center" }}>Nenhum post publicado ainda.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "32px" }}>
          {posts.map((post) => (
            <article key={post.id} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              )}
              <div style={{ padding: "20px" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "8px" }}>
                  <a href={`/s/${siteSlug}/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {post.title}
                  </a>
                </h2>
                {post.excerpt && (
                  <p style={{ color: "#64748b", fontSize: "0.9375rem", marginBottom: "12px" }}>
                    {post.excerpt}
                  </p>
                )}
                <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                  {post.author.name} ·{" "}
                  {post.publishedAt
                    ? new Intl.DateTimeFormat("pt-BR").format(post.publishedAt)
                    : ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "48px" }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/s/${siteSlug}/blog?page=${p}`}
              style={{
                padding: "8px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: p === page ? "#6366f1" : "white",
                color: p === page ? "white" : "#334155",
                textDecoration: "none",
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
