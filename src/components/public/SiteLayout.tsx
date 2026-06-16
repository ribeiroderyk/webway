interface SiteLayoutProps {
  site: {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    slug: string;
  };
  children: React.ReactNode;
}

export function SiteLayout({ site, children }: SiteLayoutProps) {
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
        <nav style={{ display: "flex", gap: "24px" }}>
          <a href={`/s/${site.slug}/blog`} style={{ color: "#334155", textDecoration: "none", fontSize: "0.9375rem" }}>
            Blog
          </a>
        </nav>
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
