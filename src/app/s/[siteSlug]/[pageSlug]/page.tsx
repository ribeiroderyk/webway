// Changed: replaced placeholder BlockRenderer with shared component
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildPageMeta, buildWebPageSchema, buildFaqSchema } from "@/lib/seo";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { SiteLayout } from "@/components/public/SiteLayout";
import type { Metadata } from "next";
import type { Block } from "@/types";

interface Props {
  params: Promise<{ siteSlug: string; pageSlug: string }>;
}

async function getPage(siteSlug: string, pageSlug: string) {
  return prisma.page.findFirst({
    where: {
      slug: pageSlug,
      status: "PUBLISHED",
      site: { slug: siteSlug, status: "PUBLISHED" },
    },
    include: {
      site: {
        select: {
          id: true, name: true, slug: true,
          language: true, primaryColor: true, description: true, logoUrl: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug, pageSlug } = await params;
  const page = await getPage(siteSlug, pageSlug);
  if (!page) return { title: "Não encontrado" };

  const meta = buildPageMeta(page, page.site);
  return {
    title: meta.title,
    description: meta.description ?? undefined,
    robots: { index: meta.robotsIndex, follow: meta.robotsFollow },
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription ?? undefined,
      images: meta.ogImageUrl ? [meta.ogImageUrl] : [],
      locale: meta.locale,
      siteName: meta.siteName,
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const page = await getPage(siteSlug, pageSlug);
  if (!page) notFound();

  const blocks = (Array.isArray(page.blocks) ? page.blocks : []) as Block[];
  const webPageSchema = buildWebPageSchema(page, page.site);

  const faqBlock = blocks.find((b) => b.type === "faq");
  const faqSchema = faqBlock
    ? buildFaqSchema(
        (faqBlock.props as { items: Array<{ question: string; answer: string }> }).items
      )
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <SiteLayout site={page.site}>
        <BlockRenderer blocks={blocks} />
      </SiteLayout>
    </>
  );
}
