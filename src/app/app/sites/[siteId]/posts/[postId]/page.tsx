import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSiteById } from "@/server/services/siteService";
import { getPost } from "@/server/services/postService";
import { PostEditor } from "@/features/editor/PostEditor";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ siteId: string; postId: string }>;
}

export const metadata: Metadata = { title: "Editar Post" };

export default async function PostEditorPage({ params }: Props) {
  const { siteId, postId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [site, post] = await Promise.all([
    getSiteById(siteId, session.user.workspaceId),
    getPost(postId, siteId),
  ]);

  if (!site || !post) notFound();

  return (
    <PostEditor
      site={{ id: site.id, name: site.name, slug: site.slug }}
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: (post.content as Record<string, unknown>) ?? null,
        status: post.status,
        coverImageUrl: post.coverImageUrl ?? "",
        seoTitle: post.seoTitle ?? "",
        seoDescription: post.seoDescription ?? "",
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      }}
    />
  );
}
