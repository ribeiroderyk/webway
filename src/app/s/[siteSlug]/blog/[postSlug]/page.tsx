import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  buildPageMeta,
  buildBlogPostingSchema,
  buildPostUrl,
  buildSiteUrl,
} from "@/lib/seo";
import type { Metadata } from "next";
import type { JSX } from "react";

interface Props {
  params: Promise<{ siteSlug: string; postSlug: string }>;
}

async function getPublishedPost(siteSlug: string, postSlug: string) {
  return prisma.post.findFirst({
    where: {
      slug: postSlug,
      status: "PUBLISHED",
      site: { slug: siteSlug, status: "PUBLISHED" },
    },
    include: {
      author: { select: { name: true } },
      site: {
        select: {
          id: true, name: true, slug: true,
          language: true, primaryColor: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { siteSlug, postSlug } = await params;
  const post = await getPublishedPost(siteSlug, postSlug);
  if (!post) return { title: "Não encontrado" };

  const title = post.seoTitle
    ? `${post.seoTitle} | ${post.site.name}`
    : `${post.title} | ${post.site.name}`;

  return {
    title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    robots: { index: post.robotsIndex, follow: post.robotsFollow },
    alternates: { canonical: post.canonicalUrl ?? buildPostUrl(siteSlug, postSlug) },
    openGraph: {
      type: "article",
      title: post.ogTitle ?? title,
      description: post.ogDescription ?? post.seoDescription ?? post.excerpt ?? undefined,
      images: post.ogImageUrl ?? post.coverImageUrl
        ? [{ url: (post.ogImageUrl ?? post.coverImageUrl)! }]
        : [],
      locale: post.site.language.replace("-", "_"),
      siteName: post.site.name,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { siteSlug, postSlug } = await params;
  const post = await getPublishedPost(siteSlug, postSlug);
  if (!post) notFound();

  const jsonLd = buildBlogPostingSchema(post, post.site, post.author);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <nav style={{ marginBottom: "24px", fontSize: "0.875rem", color: "#64748b" }}>
          <a href={`/s/${siteSlug}`}>{post.site.name}</a>
          {" › "}
          <a href={`/s/${siteSlug}/blog`}>Blog</a>
          {" › "}
          <span>{post.title}</span>
        </nav>

        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            loading="eager"
            fetchPriority="high"
            style={{ width: "100%", borderRadius: "12px", marginBottom: "32px" }}
          />
        )}

        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
          {post.title}
        </h1>

        <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "0.9375rem", marginBottom: "32px" }}>
          <span>{post.author.name}</span>
          <span>·</span>
          {post.publishedAt && (
            <span>
              {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(post.publishedAt)}
            </span>
          )}
        </div>

        <hr style={{ borderColor: "#e2e8f0", marginBottom: "32px" }} />

        {/* Conteúdo rich text — renderizado no servidor a partir do JSON do Tiptap */}
        <div
          className="prose prose-neutral max-w-none"
          style={{ lineHeight: 1.7, fontSize: "1.0625rem" }}
        >
          <TiptapRenderer content={post.content as Record<string, unknown>} />
        </div>

        <hr style={{ borderColor: "#e2e8f0", marginTop: "48px", marginBottom: "32px" }} />

        <nav style={{ display: "flex", justifyContent: "space-between" }}>
          <a href={`/s/${siteSlug}/blog`} style={{ color: "#6366f1", textDecoration: "none" }}>
            ← Ver todos os posts
          </a>
        </nav>
      </article>
    </>
  );
}

// Renderizador simples de conteúdo Tiptap (SSR)
function TiptapRenderer({ content }: { content: Record<string, unknown> }) {
  if (!content || typeof content !== "object") return null;

  const doc = content as { type: string; content?: unknown[] };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return null;

  return <>{doc.content.map((node, i) => <TiptapNode key={i} node={node as TiptapNode} />)}</>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

function TiptapNode({ node }: { node: TiptapNode }) {
  const children = node.content?.map((child, i) => (
    <TiptapNode key={i} node={child} />
  ));

  switch (node.type) {
    case "heading": {
      const level = (node.attrs?.level as number) ?? 2;
      const sizes: Record<number, string> = { 1: "2rem", 2: "1.5rem", 3: "1.25rem" };
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag style={{ marginTop: "28px", marginBottom: "12px", fontWeight: 700, fontSize: sizes[level] ?? "1.25rem" }}>{children}</Tag>;
    }
    case "paragraph":
      return <p style={{ marginBottom: "16px" }}>{children ?? null}</p>;
    case "hardBreak":
      return <br />;
    case "text": {
      let text: React.ReactNode = node.text ?? "";
      const marks = node.marks ?? [];
      const linkMark = marks.find((m) => m.type === "link");
      if (linkMark) {
        text = (
          <a href={linkMark.attrs?.href as string} target={linkMark.attrs?.target as string | undefined} rel="noopener noreferrer" style={{ color: "#6366f1", textDecoration: "underline" }}>
            {text}
          </a>
        );
      }
      if (marks.some((m) => m.type === "bold")) text = <strong>{text}</strong>;
      if (marks.some((m) => m.type === "italic")) text = <em>{text}</em>;
      if (marks.some((m) => m.type === "underline")) text = <u>{text}</u>;
      if (marks.some((m) => m.type === "strike")) text = <s>{text}</s>;
      if (marks.some((m) => m.type === "code")) {
        text = <code style={{ backgroundColor: "#f1f5f9", padding: "2px 5px", borderRadius: "4px", fontSize: "0.9em", fontFamily: "monospace" }}>{text}</code>;
      }
      return <>{text}</>;
    }
    case "image":
      return (
        <img
          src={node.attrs?.src as string}
          alt={(node.attrs?.alt as string) ?? ""}
          style={{ maxWidth: "100%", borderRadius: "8px", margin: "16px 0" }}
          loading="lazy"
        />
      );
    case "bulletList":
      return <ul style={{ paddingLeft: "24px", marginBottom: "16px" }}>{children}</ul>;
    case "orderedList":
      return <ol style={{ paddingLeft: "24px", marginBottom: "16px" }}>{children}</ol>;
    case "listItem":
      return <li style={{ marginBottom: "4px" }}>{children}</li>;
    case "blockquote":
      return (
        <blockquote style={{ borderLeft: "4px solid #6366f1", paddingLeft: "16px", color: "#475569", fontStyle: "italic", margin: "24px 0" }}>
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre style={{ backgroundColor: "#0f172a", color: "#e2e8f0", padding: "20px", borderRadius: "10px", overflowX: "auto", margin: "24px 0", fontSize: "0.9rem", lineHeight: 1.6, fontFamily: "monospace" }}>
          <code>{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr style={{ borderColor: "#e2e8f0", margin: "32px 0" }} />;
    default:
      return <>{children}</>;
  }
}
