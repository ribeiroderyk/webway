// Changed: refactored to use shared BlockRenderer and SiteLayout components
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildPageMeta, buildWebSiteSchema, buildWebPageSchema } from "@/lib/seo";
import { BlockRenderer } from "@/components/public/BlockRenderer";
import { SiteLayout } from "@/components/public/SiteLayout";
import type { Metadata } from "next";
import type { Block } from "@/types";

interface Props {
  params: Promise<{ siteSlug: string }>;
}

async function getSiteHomePage(siteSlug: string) {
  return prisma.page.findFirst({
    where: {
      slug: "/",
      status: "PUBLISHED",
      site: { slug: siteSlug, status: "PUBLISHED" },
    },
    include: {
      site: {
        select: {
          id: true, name: true, slug: true,
          language: true, primaryColor: true,
          description: true, logoUrl: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug } = await params;
  const page = await getSiteHomePage(siteSlug);
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

export default async function SiteHomePage({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getSiteHomePage(siteSlug);
  if (!page) notFound();

  const blocks = (Array.isArray(page.blocks) ? page.blocks : []) as unknown as Block[];
  const webSiteSchema = buildWebSiteSchema(page.site);
  const webPageSchema = buildWebPageSchema(page, page.site);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SiteLayout site={page.site}>
        <BlockRenderer blocks={blocks} />
      </SiteLayout>
    </>
  );
}
