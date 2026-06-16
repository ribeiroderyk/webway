"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Upload, Image as ImageIcon, FileText, Trash2, Copy, Check } from "lucide-react";

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileUrl: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/media`);
      const json = await res.json();
      setMedia(json.data?.media ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadMedia(); }, [siteId]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        await fetch(`/api/sites/${siteId}/media`, { method: "POST", body: form });
      }
      await loadMedia();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover esta mídia?")) return;
    await fetch(`/api/sites/${siteId}/media/${id}`, { method: "DELETE" });
    setMedia((m) => m.filter((item) => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Mídia</h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>{media.length} arquivo{media.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            borderRadius: "10px",
            fontWeight: 500,
            fontSize: "0.9375rem",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
          }}
        >
          <Upload size={16} /> {uploading ? "Enviando…" : "Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Drop zone (when no media) */}
      {!loading && media.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            backgroundColor: dragOver ? "#ede9fe" : "white",
            border: `2px dashed ${dragOver ? "#6366f1" : "#e2e8f0"}`,
            borderRadius: "16px",
            padding: "80px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 200ms",
          }}
        >
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Upload size={28} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>Arraste arquivos aqui</h2>
          <p style={{ color: "#64748b", marginBottom: "4px" }}>ou clique para selecionar</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>PNG, JPG, GIF, WEBP, SVG, PDF — máx. 10 MB</p>
        </div>
      )}

      {/* Media grid */}
      {!loading && media.length > 0 && (
        <div style={{ display: "flex", gap: "24px" }}>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "12px",
              alignContent: "start",
            }}
          >
            {/* Upload drop target in grid */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                aspectRatio: "1",
                border: `2px dashed ${dragOver ? "#6366f1" : "#e2e8f0"}`,
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "0.8125rem",
                backgroundColor: dragOver ? "#ede9fe" : "transparent",
                transition: "all 200ms",
              }}
            >
              <Upload size={20} color="#6366f1" />
              Upload
            </div>

            {media.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  aspectRatio: "1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: selectedItem?.id === item.id ? "2px solid #6366f1" : "2px solid transparent",
                  cursor: "pointer",
                  backgroundColor: "#f1f5f9",
                  position: "relative",
                }}
              >
                {isImage(item.mimeType) ? (
                  <img src={item.fileUrl} alt={item.altText ?? item.fileName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", padding: "8px" }}>
                    <FileText size={28} color="#64748b" />
                    <p style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                      {item.originalName}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selectedItem && (
            <div style={{ width: "260px", flexShrink: 0, backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", alignSelf: "start" }}>
              {isImage(selectedItem.mimeType) ? (
                <img src={selectedItem.fileUrl} alt={selectedItem.altText ?? selectedItem.fileName} style={{ width: "100%", borderRadius: "10px", aspectRatio: "16/9", objectFit: "cover" }} />
              ) : (
                <div style={{ backgroundColor: "#f1f5f9", borderRadius: "10px", padding: "24px", display: "flex", justifyContent: "center" }}>
                  <FileText size={40} color="#64748b" />
                </div>
              )}
              <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedItem.originalName}
              </p>
              <div style={{ fontSize: "0.8125rem", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span>{formatBytes(selectedItem.size)}</span>
                {selectedItem.width && selectedItem.height && (
                  <span>{selectedItem.width} × {selectedItem.height}px</span>
                )}
                <span>{new Intl.DateTimeFormat("pt-BR").format(new Date(selectedItem.createdAt))}</span>
              </div>
              <button
                onClick={() => copyUrl(selectedItem.fileUrl, selectedItem.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#334155",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {copiedId === selectedItem.id ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                {copiedId === selectedItem.id ? "Copiado!" : "Copiar URL"}
              </button>
              <button
                onClick={() => handleDelete(selectedItem.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <Trash2 size={14} /> Remover
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "64px", color: "#94a3b8" }}>Carregando…</div>
      )}
    </div>
  );
}
