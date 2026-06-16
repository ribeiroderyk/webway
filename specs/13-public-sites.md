# Sites Públicos — Especificação

> Sites gerados pela plataforma Web Way, acessíveis publicamente em `/s/[siteSlug]`.

---

## Estrutura das Rotas Públicas

```
/s/[siteSlug]                    ← Home do site
/s/[siteSlug]/[pageSlug]         ← Página interna
/s/[siteSlug]/blog               ← Listagem de posts
/s/[siteSlug]/blog/[postSlug]    ← Post individual
/s/[siteSlug]/sitemap.xml        ← Sitemap do site
```

---

## Regras de Renderização

### Acesso ao Site

| Condição                  | Resultado                        |
|---------------------------|----------------------------------|
| Site `status = "published"`| Renderiza normalmente            |
| Site `status = "draft"`   | 404 (não revelar existência)     |
| Site `status = "archived"`| 410 Gone                         |
| Site inexistente          | 404                              |

### Acesso à Página

| Condição                    | Resultado    |
|-----------------------------|--------------|
| Página `status = "published"`| Renderiza   |
| Página `status = "draft"`   | 404          |
| Slug não encontrado         | 404          |

### Estratégia de Renderização

- **SSR** (Server-Side Rendering): padrão para páginas com conteúdo dinâmico
- **ISR** (Incremental Static Regeneration): para posts de blog (`revalidate: 60`)
- Conteúdo principal sempre no HTML inicial (nunca depender de client-only)

---

## Layout Padrão do Site Público

```
┌─────────────────────────────────────────────────────────────────┐
│                      [SITE HEADER]                              │
│  [Logo/Nome do site]      [Nav: Home · Sobre · Blog · Contato]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    [BLOCO 1 — Hero]                             │
│                                                                 │
│                    [BLOCO 2 — FeatureGrid]                      │
│                                                                 │
│                    [BLOCO 3 — CTA]                              │
│                                                                 │
│                    ...demais blocos...                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      [SITE FOOTER]                              │
│  © 2026 Studio Web Way · Criado com Web Way                     │
└─────────────────────────────────────────────────────────────────┘
```

### Site Header

Gerado dinamicamente a partir das configurações do site:

```tsx
<SiteHeader
  siteName={site.name}
  logoUrl={site.logoUrl}
  primaryColor={site.primaryColor}
  pages={publishedPages.filter(p => p.showInNav)}
/>
```

### Site Footer

```tsx
<SiteFooter
  siteName={site.name}
  year={new Date().getFullYear()}
  attribution // "Criado com Web Way" (pode ser removido futuramente)
/>
```

---

## Metadata Dinâmica

Para cada página/post, gerar via Next.js `generateMetadata()`:

```ts
export async function generateMetadata({ params }) {
  const page = await getPage(params.siteSlug, params.pageSlug);
  
  return {
    title: page.seoTitle || `${page.title} | ${site.name}`,
    description: page.seoDescription,
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
    alternates: {
      canonical: page.canonicalUrl || `${siteUrl}/${page.slug}`,
    },
    openGraph: {
      title: page.ogTitle || page.seoTitle || page.title,
      description: page.ogDescription || page.seoDescription,
      images: page.ogImageUrl ? [{ url: page.ogImageUrl }] : [],
      type: "website",
      locale: site.language,
    },
  };
}
```

---

## JSON-LD por Tipo de Conteúdo

### WebSite (todas as páginas)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Studio Web Way",
  "url": "https://webway.app/s/studio-web-way"
}
```

### WebPage (páginas internas)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Sobre nós",
  "description": "Conheça nossa equipe...",
  "url": "https://webway.app/s/studio-web-way/sobre",
  "isPartOf": { "@type": "WebSite", "url": "..." },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
}
```

### BlogPosting (posts)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Como criar sites rápidos",
  "author": { "@type": "Person", "name": "João Silva" },
  "datePublished": "2026-06-10T00:00:00Z",
  "dateModified": "2026-06-12T00:00:00Z",
  "image": "https://webway.app/uploads/studio/cover.jpg",
  "url": "https://webway.app/s/studio-web-way/blog/como-criar-sites"
}
```

### FAQPage (quando há bloco FAQ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "O que é a Web Way?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Web Way é um CMS moderno..."
      }
    }
  ]
}
```

---

## Sitemap do Site

**Rota:** `/s/[siteSlug]/sitemap.xml`

```ts
export async function GET(req, { params }) {
  const site = await getSiteBySlug(params.siteSlug);
  if (!site || site.status !== "published") {
    return new Response(null, { status: 404 });
  }
  
  const pages = await getPublishedPages(site.id);
  const posts = await getPublishedPosts(site.id);
  
  const xml = generateSitemapXml([
    { url: siteUrl, lastmod: site.updatedAt, priority: 1.0 },
    ...pages.map(p => ({ url: `${siteUrl}/${p.slug}`, lastmod: p.updatedAt, priority: 0.8 })),
    ...posts.map(p => ({ url: `${siteUrl}/blog/${p.slug}`, lastmod: p.updatedAt, priority: 0.6 })),
  ]);
  
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

---

## Performance das Páginas Públicas

### Princípios

1. HTML renderizado no servidor (SSR/SSG)
2. JavaScript mínimo no cliente
3. Imagens com `loading="lazy"` (exceto acima do fold)
4. Imagens com `width` e `height` para evitar CLS
5. Fontes pré-carregadas com `<link rel="preload">`
6. CSS crítico inline (se aplicável)
7. Headers de cache: `Cache-Control: public, max-age=60, stale-while-revalidate=300`

### Headers de Segurança

```ts
// next.config.js
headers: [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
]
```

---

## 404 Personalizado

Para sites publicados, exibir página 404 com identidade do site:

```
┌────────────────────────────────────────────┐
│  [Header do site]                          │
│                                            │
│      404 — Página não encontrada          │
│                                            │
│  A página que você está procurando         │
│  não existe ou foi removida.               │
│                                            │
│  [← Voltar para o início]                  │
│                                            │
│  [Footer do site]                          │
└────────────────────────────────────────────┘
```
