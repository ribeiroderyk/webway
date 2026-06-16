"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Globe, Eye, EyeOff,
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Code, Link as LinkIcon,
  Heading1, Heading2, Heading3,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapUnderline from "@tiptap/extension-underline";
import TiptapImage from "@tiptap/extension-image";
import TiptapPlaceholder from "@tiptap/extension-placeholder";

interface PostEditorProps {
  site: { id: string; name: string; slug: string };
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: Record<string, unknown> | null;
    status: string;
    coverImageUrl: string;
    seoTitle: string;
    seoDescription: string;
    publishedAt: string | null;
  };
}

export function PostEditor({ site, post }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [coverImageUrl, setCoverImageUrl] = useState(post.coverImageUrl);
  const [seoTitle, setSeoTitle] = useState(post.seoTitle);
  const [seoDescription, setSeoDescription] = useState(post.seoDescription);
  const [status, setStatus] = useState(post.status);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapUnderline,
      TiptapImage,
      TiptapPlaceholder.configure({ placeholder: "Escreva o conteúdo do seu post aqui…" }),
    ],
    content: post.content ?? { type: "doc", content: [] },
    onUpdate: () => setIsDirty(true),
    editorProps: {
      attributes: {
        style: "min-height: 400px; outline: none; font-size: 1.0625rem; line-height: 1.75; color: #0f172a;",
      },
    },
  });

  async function save(explicit = true) {
    if (explicit) setSaving(true);
    try {
      await fetch(`/api/sites/${site.id}/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || undefined,
          content: editor?.getJSON(),
          coverImageUrl: coverImageUrl || undefined,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
        }),
      });
      setIsDirty(false);
    } finally {
      if (explicit) setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);
    try {
      await save(false);
      const res = await fetch(`/api/sites/${site.id}/posts/${post.id}/publish`, {
        method: "POST",
      });
      if (res.ok) setStatus("PUBLISHED");
    } finally {
      setPublishing(false);
    }
  }

  async function unpublish() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/sites/${site.id}/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT" }),
      });
      if (res.ok) setStatus("DRAFT");
    } finally {
      setPublishing(false);
    }
  }

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) save();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isDirty, title, excerpt, coverImageUrl, seoTitle, seoDescription]);

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <Link
          href={`/app/sites/${site.id}/posts`}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "0.9375rem" }}
        >
          <ArrowLeft size={16} /> Blog
        </Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {isDirty && <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Alterações não salvas</span>}
          <button
            onClick={() => save()}
            disabled={!isDirty || saving}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "8px",
              backgroundColor: "white", color: "#334155", fontWeight: 500, fontSize: "0.875rem",
              cursor: isDirty && !saving ? "pointer" : "not-allowed",
              opacity: !isDirty || saving ? 0.6 : 1,
            }}
          >
            <Save size={15} />{saving ? "Salvando…" : "Salvar"}
          </button>
          {status === "PUBLISHED" ? (
            <button
              onClick={unpublish}
              disabled={publishing}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", backgroundColor: "#64748b", color: "white", fontWeight: 500, fontSize: "0.875rem", cursor: publishing ? "not-allowed" : "pointer", opacity: publishing ? 0.7 : 1 }}
            >
              <EyeOff size={15} />{publishing ? "Aguarde…" : "Despublicar"}
            </button>
          ) : (
            <button
              onClick={publish}
              disabled={publishing}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", backgroundColor: "#6366f1", color: "white", fontWeight: 500, fontSize: "0.875rem", cursor: publishing ? "not-allowed" : "pointer", opacity: publishing ? 0.7 : 1 }}
            >
              <Globe size={15} />{publishing ? "Publicando…" : "Publicar"}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>
        {/* Main editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
            placeholder="Título do post"
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#0f172a",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              width: "100%",
              padding: "0",
            }}
          />

          {/* Cover image */}
          {coverImageUrl && (
            <img src={coverImageUrl} alt="" style={{ width: "100%", borderRadius: "12px", maxHeight: "360px", objectFit: "cover" }} />
          )}

          {/* Tiptap editor */}
          <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
            <EditorToolbar editor={editor} />
            <div style={{ padding: "24px" }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Publication card */}
          <SidebarCard title="Publicação">
            <StatusBadge status={status} />
            {post.publishedAt && (
              <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "8px" }}>
                Publicado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(post.publishedAt))}
              </p>
            )}
          </SidebarCard>

          {/* Cover image card */}
          <SidebarCard title="Imagem de capa">
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => { setCoverImageUrl(e.target.value); setIsDirty(true); }}
              placeholder="https://…"
              style={sidebarInputStyle}
            />
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>URL da imagem de capa</p>
          </SidebarCard>

          {/* Excerpt card */}
          <SidebarCard title="Resumo">
            <textarea
              value={excerpt}
              onChange={(e) => { setExcerpt(e.target.value); setIsDirty(true); }}
              placeholder="Breve resumo para SEO e listagens…"
              rows={3}
              style={{ ...sidebarInputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </SidebarCard>

          {/* SEO card */}
          <SidebarCard title="SEO">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={sidebarLabelStyle}>Título SEO</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => { setSeoTitle(e.target.value); setIsDirty(true); }}
                  placeholder={title}
                  style={sidebarInputStyle}
                />
                <p style={{ fontSize: "0.75rem", color: seoTitle.length > 60 ? "#ef4444" : "#94a3b8", marginTop: "2px" }}>
                  {seoTitle.length}/60
                </p>
              </div>
              <div>
                <label style={sidebarLabelStyle}>Descrição SEO</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => { setSeoDescription(e.target.value); setIsDirty(true); }}
                  placeholder={excerpt}
                  rows={3}
                  style={{ ...sidebarInputStyle, resize: "vertical", lineHeight: 1.5 }}
                />
                <p style={{ fontSize: "0.75rem", color: seoDescription.length > 160 ? "#ef4444" : "#94a3b8", marginTop: "2px" }}>
                  {seoDescription.length}/160
                </p>
              </div>
            </div>
            {/* SERP preview */}
            {(seoTitle || title) && (
              <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "0.8125rem" }}>
                <p style={{ color: "#1a0dab", fontWeight: 500, marginBottom: "2px" }}>{seoTitle || title}</p>
                <p style={{ color: "#006621", marginBottom: "2px" }}>/s/{site.slug}/blog/{post.slug}</p>
                <p style={{ color: "#545454" }}>{seoDescription || excerpt || "Sem descrição."}</p>
              </div>
            )}
          </SidebarCard>

          {/* View live link */}
          {status === "PUBLISHED" && (
            <a
              href={`/s/${site.slug}/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                color: "#334155",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <Eye size={15} /> Ver post publicado
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, children: React.ReactNode, title: string) => (
    <button
      key={title}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        padding: "6px 8px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: active ? "#ede9fe" : "transparent",
        color: active ? "#6366f1" : "#64748b",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );

  return (
    <div
      style={{
        padding: "8px 12px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        flexWrap: "wrap",
        gap: "2px",
        alignItems: "center",
      }}
    >
      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={16} />, "H1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={16} />, "H2")}
      {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={16} />, "H3")}
      <Divider />
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold size={16} />, "Negrito")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic size={16} />, "Itálico")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <Underline size={16} />, "Sublinhado")}
      {btn(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={16} />, "Tachado")}
      {btn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), <Code size={16} />, "Código inline")}
      <Divider />
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List size={16} />, "Lista")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={16} />, "Lista ordenada")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote size={16} />, "Citação")}
      {btn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), <Code size={16} />, "Bloco de código")}
      <Divider />
      {btn(
        editor.isActive("link"),
        () => {
          const url = window.prompt("URL do link:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
          else editor.chain().focus().unsetLink().run();
        },
        <LinkIcon size={16} />,
        "Link"
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ width: "1px", height: "20px", backgroundColor: "#e2e8f0", margin: "0 4px" }} />;
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px" }}>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>{title}</p>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    PUBLISHED: { label: "Publicado", color: "#166534", bg: "#dcfce7" },
    DRAFT: { label: "Rascunho", color: "#92400e", bg: "#fef3c7" },
    ARCHIVED: { label: "Arquivado", color: "#475569", bg: "#f1f5f9" },
  };
  const c = config[status] ?? { label: "Rascunho", color: "#92400e", bg: "#fef3c7" };
  return (
    <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: c.color, backgroundColor: c.bg, padding: "3px 10px", borderRadius: "9999px" }}>
      {c.label}
    </span>
  );
}

const sidebarLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "4px",
};

const sidebarInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.875rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};
