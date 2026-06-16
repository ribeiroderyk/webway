import { env } from "./env";

export function buildSiteUrl(siteSlug: string): string {
  return `${env.NEXT_PUBLIC_APP_URL}/s/${siteSlug}`;
}

export function buildPageUrl(siteSlug: string, pageSlug: string): string {
  if (pageSlug === "/") return buildSiteUrl(siteSlug);
  return `${buildSiteUrl(siteSlug)}/${pageSlug}`;
}

export function buildPostUrl(siteSlug: string, postSlug: string): string {
  return `${buildSiteUrl(siteSlug)}/blog/${postSlug}`;
}

export interface SeoMeta {
  title: string;
  description: string | null;
  canonical: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string | null;
  ogImageUrl: string | null;
  locale: string;
  siteName: string;
}

export function buildPageMeta(
  page: {
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImageUrl: string | null;
    slug: string;
  },
  site: { name: string; slug: string; language: string },
  separator = "|"
): SeoMeta {
  const title = page.seoTitle
    ? `${page.seoTitle} ${separator} ${site.name}`
    : `${page.title} ${separator} ${site.name}`;

  return {
    title,
    description: page.seoDescription,
    canonical:
      page.canonicalUrl ?? buildPageUrl(site.slug, page.slug),
    robotsIndex: page.robotsIndex,
    robotsFollow: page.robotsFollow,
    ogTitle: page.ogTitle ?? title,
    ogDescription: page.ogDescription ?? page.seoDescription,
    ogImageUrl: page.ogImageUrl,
    locale: site.language.replace("-", "_"),
    siteName: site.name,
  };
}

// ── JSON-LD builders ──────────────────────────────────────────────

export function buildWebSiteSchema(site: {
  name: string;
  slug: string;
  description?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: buildSiteUrl(site.slug),
    ...(site.description ? { description: site.description } : {}),
  };
}

export function buildWebPageSchema(
  page: { title: string; seoDescription?: string | null; slug: string },
  site: { name: string; slug: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: buildPageUrl(site.slug, page.slug),
    ...(page.seoDescription ? { description: page.seoDescription } : {}),
    isPartOf: {
      "@type": "WebSite",
      url: buildSiteUrl(site.slug),
    },
  };
}

export function buildBlogPostingSchema(
  post: {
    title: string;
    seoDescription?: string | null;
    slug: string;
    coverImageUrl?: string | null;
    publishedAt?: Date | null;
    updatedAt: Date;
  },
  site: { name: string; slug: string },
  author: { name: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: buildPostUrl(site.slug, post.slug),
    ...(post.seoDescription ? { description: post.seoDescription } : {}),
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    author: { "@type": "Person", name: author.name },
    publisher: { "@type": "Organization", name: site.name },
    ...(post.publishedAt
      ? { datePublished: post.publishedAt.toISOString() }
      : {}),
    dateModified: post.updatedAt.toISOString(),
  };
}

export function buildFaqSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

// ── SEO Audit ─────────────────────────────────────────────────────

interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface SeoCheck {
  id: string;
  label: string;
  points: number;
  passed: boolean;
  suggestion: string;
}

export function auditPageSeo(
  page: {
    title: string;
    seoTitle: string | null;
    seoDescription: string | null;
    slug: string;
    status: string;
    ogTitle: string | null;
    ogImageUrl: string | null;
  },
  blocks: Block[]
): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = [
    {
      id: "has-seo-title",
      label: "Título SEO preenchido",
      points: 20,
      passed: !!(page.seoTitle || page.title),
      suggestion: "Preencha o título SEO da página",
    },
    {
      id: "has-seo-description",
      label: "Descrição SEO preenchida",
      points: 20,
      passed: !!page.seoDescription,
      suggestion: "Adicione uma meta description com 120-160 caracteres",
    },
    {
      id: "has-h1",
      label: "H1 único na página",
      points: 10,
      passed: blocks.some((b) => b.type === "hero"),
      suggestion: "Adicione um bloco Hero com o título principal da página",
    },
    {
      id: "friendly-slug",
      label: "Slug amigável",
      points: 10,
      passed: /^[a-z0-9-/]+$/.test(page.slug) && page.slug.length <= 60,
      suggestion: "Use apenas letras minúsculas, números e hífens no slug",
    },
    {
      id: "images-have-alt",
      label: "Imagens com alt text",
      points: 10,
      passed: blocks
        .filter((b) => b.type === "image")
        .every((b) => !!(b.props as { altText?: string }).altText),
      suggestion: "Adicione texto alternativo em todas as imagens",
    },
    {
      id: "has-canonical",
      label: "URL canônica presente",
      points: 5,
      passed: true,
      suggestion: "",
    },
    {
      id: "is-published",
      label: "Página publicada",
      points: 5,
      passed: page.status === "PUBLISHED",
      suggestion: "Publique a página para ser indexada pelo Google",
    },
    {
      id: "has-og",
      label: "Open Graph configurado",
      points: 10,
      passed: !!(page.ogTitle && page.ogImageUrl),
      suggestion: "Configure título e imagem Open Graph para compartilhamento social",
    },
    {
      id: "min-content",
      label: "Conteúdo mínimo",
      points: 10,
      passed: countBlockWords(blocks) >= 100,
      suggestion: "Adicione mais conteúdo textual à página (mínimo 100 palavras)",
    },
  ];

  const score = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.points, 0);

  return { score, checks };
}

function countBlockWords(blocks: Block[]): number {
  let count = 0;
  for (const block of blocks) {
    const props = block.props as Record<string, string>;
    for (const key of ["headline", "subheadline", "title", "content", "description"]) {
      if (typeof props[key] === "string") {
        count += props[key].split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return count;
}
