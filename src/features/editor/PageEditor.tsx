"use client";

import { useState, useCallback, useRef } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Globe,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import type { Block } from "@/types";
import { BlockLibrary } from "./BlockLibrary";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { createBlock } from "./blocks/registry";

interface PageEditorProps {
  site: { id: string; name: string; slug: string };
  page: {
    id: string;
    title: string;
    slug: string;
    status: string;
    blocks: Block[];
  };
}

type Viewport = "desktop" | "tablet" | "mobile";

export function PageEditor({ site, page }: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(page.blocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState(page.status);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

  function markDirty(newBlocks: Block[]) {
    setBlocks(newBlocks);
    setIsDirty(true);

    // Autosave after 30s of inactivity
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      void saveBlocks(newBlocks, false);
    }, 30_000);
  }

  async function saveBlocks(blocksToSave: Block[], explicit = true) {
    if (explicit) setSaving(true);
    try {
      const res = await fetch(`/api/sites/${site.id}/pages/${page.id}/blocks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: blocksToSave }),
      });
      if (res.ok) setIsDirty(false);
    } finally {
      if (explicit) setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      await saveBlocks(blocks, false);
      const res = await fetch(`/api/sites/${site.id}/pages/${page.id}/publish`, {
        method: "POST",
      });
      if (res.ok) setStatus("PUBLISHED");
    } finally {
      setPublishing(false);
    }
  }

  function addBlock(type: string) {
    const newBlock = createBlock(type);
    const updated = [...blocks, newBlock];
    markDirty(updated);
    setSelectedBlockId(newBlock.id);
  }

  function updateBlock(id: string, props: Record<string, unknown>) {
    const updated = blocks.map((b) => (b.id === id ? { ...b, props } : b));
    markDirty(updated);
  }

  function moveBlock(id: string, direction: "up" | "down") {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const updated = [...blocks];
    const swapWith = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[swapWith]] = [updated[swapWith]!, updated[index]!];
    markDirty(updated);
  }

  function deleteBlock(id: string) {
    const updated = blocks.filter((b) => b.id !== id);
    markDirty(updated);
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  const viewportWidths: Record<Viewport, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Editor topbar */}
      <div
        style={{
          height: "56px",
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Left: back + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href={`/app/sites/${site.id}/pages`}
            style={{ color: "#64748b", display: "flex", alignItems: "center" }}
            title="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>
          <span style={{ color: "#94a3b8" }}>|</span>
          <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0f172a" }}>
            {page.title}
            {isDirty && <span style={{ color: "#94a3b8", marginLeft: "4px" }}>*</span>}
          </span>
        </div>

        {/* Center: viewport switcher */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "#f1f5f9", borderRadius: "10px", padding: "4px" }}>
          {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
            <ViewportBtn
              key={v}
              viewport={v}
              active={viewport === v}
              onClick={() => setViewport(v)}
            />
          ))}
        </div>

        {/* Right: save + publish */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => saveBlocks(blocks)}
            disabled={!isDirty || saving}
            style={{
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              backgroundColor: "white",
              color: "#334155",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: isDirty && !saving ? "pointer" : "not-allowed",
              opacity: !isDirty || saving ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Save size={15} />
            {saving ? "Salvando…" : "Salvar"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: status === "PUBLISHED" ? "#22c55e" : "#6366f1",
              color: "white",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: publishing ? "not-allowed" : "pointer",
              opacity: publishing ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Globe size={15} />
            {publishing ? "Publicando…" : status === "PUBLISHED" ? "Publicado" : "Publicar"}
          </button>
        </div>
      </div>

      {/* 3-column editor body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Block library */}
        <BlockLibrary onAddBlock={addBlock} />

        {/* Canvas */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "24px", backgroundColor: "#e2e8f0" }}>
          <div
            style={{
              width: viewportWidths[viewport],
              maxWidth: "100%",
              backgroundColor: "white",
              minHeight: "600px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              transition: "width 250ms ease",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Canvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelect={setSelectedBlockId}
              onMove={moveBlock}
              onDelete={deleteBlock}
              onAdd={addBlock}
            />
          </div>
        </div>

        {/* Properties panel */}
        <PropertiesPanel
          block={selectedBlock}
          onChange={(props) => selectedBlock && updateBlock(selectedBlock.id, props)}
        />
      </div>
    </div>
  );
}

function ViewportBtn({
  viewport,
  active,
  onClick,
}: {
  viewport: Viewport;
  active: boolean;
  onClick: () => void;
}) {
  const icons: Record<Viewport, React.ElementType> = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };
  const Icon = icons[viewport];

  return (
    <button
      onClick={onClick}
      title={viewport}
      style={{
        padding: "6px 10px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: active ? "white" : "transparent",
        color: active ? "#6366f1" : "#64748b",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Icon size={16} />
    </button>
  );
}
