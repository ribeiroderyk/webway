import { prisma } from "@/lib/prisma";

interface SiteLayoutProps {
  site: {
    id: string;
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    slug: string;
  };
  children: React.ReactNode;
}

async function getNavPages(siteId: string) {
  return prisma.page.findMany({
    where: { siteId, status: "PUBLISHED", showInNav: true, slug: { not: "/" } },
    orderBy: { navOrder: "asc" },
    select: { title: true, slug: true },
    take: 8,
  });
}

async function hasBlogPosts(siteId: string) {
  const count = await prisma.post.count({
    where: { siteId, status: "PUBLISHED" },
  });
  return count > 0;
}

export async function SiteLayout({ site, children }: SiteLayoutProps) {
  const [navPages, showBlog] = await Promise.all([
    getNavPages(site.id),
    hasBlogPosts(site.id),
  ]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href={`/s/${site.slug}`} style={{ textDecoration: "none" }}>
          {site.logoUrl ? (
            <img src={site.logoUrl} alt={site.name} style={{ height: "32px" }} />
          ) : (
            <span style={{ fontWeight: 700, fontSize: "1.125rem", color: site.primaryColor }}>
              {site.name}
            </span>
          )}
        </a>
        {(navPages.length > 0 || showBlog) && (
          <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {navPages.map((page) => (
              <a
                key={page.slug}
                href={`/s/${site.slug}/${page.slug}`}
                style={{ color: "#334155", textDecoration: "none", fontSize: "0.9375rem" }}
              >
                {page.title}
              </a>
            ))}
            {showBlog && (
              <a href={`/s/${site.slug}/blog`} style={{ color: "#334155", textDecoration: "none", fontSize: "0.9375rem" }}>
                Blog
              </a>
            )}
          </nav>
        )}
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "24px",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#64748b",
        }}
      >
        © {new Date().getFullYear()} {site.name} · Criado com{" "}
        <a href="/" style={{ color: "#6366f1", textDecoration: "none" }}>
          Web Way
        </a>
      </footer>
    </div>
  );
}
