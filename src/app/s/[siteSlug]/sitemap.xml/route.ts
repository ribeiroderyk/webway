import { prisma } from "@/lib/prisma";
import { buildSiteUrl, buildPageUrl, buildPostUrl } from "@/lib/seo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteSlug: string }> }
) {
  const { siteSlug } = await params;

  const site = await prisma.site.findFirst({
    where: { slug: siteSlug, status: "PUBLISHED" },
    select: { id: true, name: true, slug: true, updatedAt: true },
  });

  if (!site) {
    return new Response(null, { status: 404 });
  }

  const [pages, posts] = await Promise.all([
    prisma.page.findMany({
      where: { siteId: site.id, status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.post.findMany({
      where: { siteId: site.id, status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const siteUrl = buildSiteUrl(siteSlug);

  const urls = [
    { url: siteUrl, lastmod: site.updatedAt, priority: "1.0", changefreq: "weekly" },
    ...pages
      .filter((p) => p.slug !== "/")
      .map((p) => ({
        url: buildPageUrl(siteSlug, p.slug),
        lastmod: p.updatedAt,
        priority: "0.8",
        changefreq: "monthly",
      })),
    ...posts.map((p) => ({
      url: buildPostUrl(siteSlug, p.slug),
      lastmod: p.updatedAt,
      priority: "0.6",
      changefreq: "never",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod.toISOString().split("T")[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
