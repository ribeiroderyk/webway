import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { getPageWithBlocks } from "@/server/services/pageService";
import { PageEditor } from "@/features/editor/PageEditor";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ siteId: string; pageId: string }>;
}

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage({ params }: Props) {
  const { siteId, pageId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [site, page] = await Promise.all([
    getSiteById(siteId, session.user.workspaceId),
    getPageWithBlocks(pageId, siteId),
  ]);

  if (!site || !page) notFound();

  return (
    <PageEditor
      site={{ id: site.id, name: site.name, slug: site.slug }}
      page={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        blocks: Array.isArray(page.blocks) ? (page.blocks as import("@/types").Block[]) : [],
      }}
    />
  );
}
