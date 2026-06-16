# SEO Técnico — Web Way

> Guia completo de como o SEO técnico funciona na plataforma.

---

## Princípios Fundamentais

A Web Way foi projetada para que **todo site publicado seja fácil de rastrear, indexar e ranquear no Google**.

Pilares:

1. **Renderização server-side** — conteúdo no HTML inicial
2. **Metadata completa** — title, description, OG, Twitter
3. **Dados estruturados** — JSON-LD para rich results
4. **URLs limpas** — slugs legíveis, sem parâmetros desnecessários
5. **Sitemap automático** — sempre atualizado
6. **robots.txt inteligente** — bloqueia admin, libera sites públicos
7. **Performance** — Core Web Vitals otimizados

---

## 1. Renderização Server-Side

Todas as páginas públicas usam SSR ou ISR (nunca apenas CSR):

```ts
// Página pública — SSR
export default async function PublicPage({ params }) {
  // Dados buscados no servidor — presentes no HTML inicial
  const page = await getPublishedPage(params.siteSlug, params.pageSlug);
  return <BlockRenderer blocks={page.blocks} />;
}
```

O Googlebot recebe HTML completo com todo o conteúdo. Não é necessário executar JavaScript para indexar.

---

## 2. Metadata Dinâmica

Usando `generateMetadata()` do Next.js:

```ts
export async function generateMetadata({ params }) {
  const { site, page } = await getSiteAndPage(params);
  
  const title = page.seoTitle
    ? `${page.seoTitle} | ${site.name}`
    : `${page.title} | ${site.name}`;
    
  return {
    title,
    description: page.seoDescription || undefined,
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
    alternates: {
      canonical: page.canonicalUrl || buildCanonicalUrl(site, page),
    },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || page.seoDescription,
      images: page.ogImageUrl ? [{ url: page.ogImageUrl, width: 1200, height: 630 }] : [],
      type: "website",
      locale: site.language?.replace("-", "_") || "pt_BR",
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle || title,
      description: page.ogDescription || page.seoDescription,
      images: page.ogImageUrl ? [page.ogImageUrl] : [],
    },
  };
}
```

---

## 3. Dados Estruturados (JSON-LD)

### Implementação

```tsx
// Componente JsonLd
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### WebSite (home do site)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Studio Web Way",
  "url": "https://webway.app/s/studio-web-way",
  "description": "Agência digital especializada em sites modernos",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://webway.app/s/studio/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### WebPage (páginas internas)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Sobre nós",
  "url": "https://webway.app/s/studio-web-way/sobre",
  "description": "Conheça nossa equipe",
  "isPartOf": {
    "@type": "WebSite",
    "url": "https://webway.app/s/studio-web-way"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://webway.app/s/studio-web-way" },
      { "@type": "ListItem", "position": 2, "name": "Sobre nós" }
    ]
  }
}
```

### BlogPosting (posts)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Como criar sites rápidos",
  "description": "Aprenda a criar sites...",
  "image": "https://webway.app/uploads/cover.jpg",
  "author": {
    "@type": "Person",
    "name": "João Silva"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Studio Web Way"
  },
  "datePublished": "2026-06-10T00:00:00Z",
  "dateModified": "2026-06-12T00:00:00Z",
  "url": "https://webway.app/s/studio-web-way/blog/como-criar"
}
```

### FAQPage (bloco FAQ)

Gerado automaticamente quando a página tem um `FAQBlock`:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pergunta 1?",
      "acceptedAnswer": { "@type": "Answer", "text": "Resposta 1" }
    }
  ]
}
```

---

## 4. URLs Limpas

### Formato das URLs

```
/s/[siteSlug]                    ← Home do site
/s/[siteSlug]/[pageSlug]         ← Página interna
/s/[siteSlug]/blog               ← Listagem
/s/[siteSlug]/blog/[postSlug]    ← Post
```

### Regras para Slugs

- Apenas letras minúsculas, números e hífens: `[a-z0-9-]`
- Sem espaços ou caracteres especiais
- Sem underscores (SEO: hífens são preferidos pelo Google)
- Sem trailing slash
- Máximo 60 caracteres

### Geração de Slug

```ts
// /src/lib/slug.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // remove acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "");
}
```

### Canonical URLs

Definida automaticamente com a URL atual do site. Pode ser sobrescrita manualmente.

```html
<link rel="canonical" href="https://webway.app/s/studio/sobre" />
```

---

## 5. Sitemap XML

### Geração

```ts
// /src/app/s/[siteSlug]/sitemap.xml/route.ts
export async function GET(request, { params }) {
  const site = await getSiteBySlug(params.siteSlug);
  
  const urls = [
    { url: siteUrl, lastmod: site.updatedAt, priority: "1.0", changefreq: "weekly" },
    ...pages.map((p) => ({
      url: `${siteUrl}/${p.slug}`,
      lastmod: p.updatedAt,
      priority: "0.8",
      changefreq: "monthly",
    })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastmod: p.updatedAt,
      priority: "0.6",
      changefreq: "never",
    })),
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod.toISOString()}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
```

---

## 6. robots.txt

```ts
// /src/app/robots.txt/route.ts
export async function GET() {
  const content = `User-agent: *
Allow: /
Allow: /s/
Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password

Sitemap: ${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
```

---

## 7. Checklist de Auditoria SEO

Implementado em `/src/server/services/seoService.ts`:

```ts
interface SeoCheck {
  id: string;
  label: string;
  points: number;
  check: (page: Page, blocks: Block[]) => boolean;
  suggestion: string;
}

const seoChecks: SeoCheck[] = [
  {
    id: "has-seo-title",
    label: "Título SEO preenchido",
    points: 20,
    check: (page) => !!(page.seoTitle || page.title),
    suggestion: "Preencha o título SEO da página",
  },
  {
    id: "has-seo-description",
    label: "Descrição SEO preenchida",
    points: 20,
    check: (page) => !!page.seoDescription,
    suggestion: "Adicione uma meta description com 120-160 caracteres",
  },
  {
    id: "has-h1",
    label: "H1 único na página",
    points: 10,
    check: (_, blocks) => blocks.some((b) => b.type === "hero"),
    suggestion: "Adicione um bloco Hero com o título principal",
  },
  {
    id: "friendly-slug",
    label: "Slug amigável",
    points: 10,
    check: (page) => /^[a-z0-9-/]+$/.test(page.slug) && page.slug.length <= 60,
    suggestion: "Use apenas letras minúsculas, números e hífens no slug",
  },
  {
    id: "images-have-alt",
    label: "Imagens com alt text",
    points: 10,
    check: (_, blocks) => {
      const imageBlocks = blocks.filter((b) => b.type === "image");
      return imageBlocks.every((b) => (b.props as any).altText);
    },
    suggestion: "Adicione alt text em todas as imagens",
  },
  {
    id: "has-canonical",
    label: "URL canônica presente",
    points: 5,
    check: () => true,  // sempre definida automaticamente
    suggestion: "",
  },
  {
    id: "is-published",
    label: "Página publicada",
    points: 5,
    check: (page) => page.status === "PUBLISHED",
    suggestion: "Publique a página para ser indexada",
  },
  {
    id: "has-og",
    label: "Open Graph configurado",
    points: 10,
    check: (page) => !!(page.ogTitle && page.ogImageUrl),
    suggestion: "Configure título e imagem Open Graph para compartilhamento social",
  },
  {
    id: "min-content",
    label: "Conteúdo mínimo (300 palavras)",
    points: 10,
    check: (_, blocks) => countWords(blocks) >= 300,
    suggestion: "Adicione mais conteúdo textual à página",
  },
];

export function calculateSeoScore(page: Page, blocks: Block[]): SeoAuditResult {
  const results = seoChecks.map((check) => ({
    ...check,
    passed: check.check(page, blocks),
  }));
  
  const score = results
    .filter((r) => r.passed)
    .reduce((sum, r) => sum + r.points, 0);
    
  return { score, checks: results };
}
```

---

## 8. Performance e Core Web Vitals

### LCP (Largest Contentful Paint)

- Imagem hero: `loading="eager"` + `fetchpriority="high"` no primeiro bloco
- Demais imagens: `loading="lazy"`
- Pré-carregar imagem hero com `<link rel="preload">`

### CLS (Cumulative Layout Shift)

- Sempre definir `width` e `height` nas imagens
- Reservar espaço para embeds
- Fontes carregadas com `font-display: swap`

### INP (Interaction to Next Paint)

- JavaScript mínimo nas páginas públicas
- Evitar hydration pesada
- Event handlers leves

### Compressão

```ts
// next.config.ts
module.exports = {
  compress: true,  // gzip habilitado
  // brotli via configuração do servidor (Nginx)
};
```
