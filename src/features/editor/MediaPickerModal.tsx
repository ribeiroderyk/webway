"use client";

import { useState, useEffect } from "react";
import { X, Search, ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  fileUrl: string;
  originalName: string;
  altText: string;
  mimeType: string;
  width?: number | null;
  height?: number | null;
}

interface MediaPickerModalProps {
  siteId: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function MediaPickerModal({ siteId, onSelect, onClose }: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sites/${siteId}/media?perPage=100`)
      .then((r) => r.json())
      .then((json) => {
        const data = (json as { data: { media: MediaItem[] } }).data;
        setMedia(data.media ?? []);
      })
      .finally(() => setLoading(false));
  }, [siteId]);

  const images = media.filter(
    (m) => m.mimeType.startsWith("image/") &&
      m.originalName.toLowerCase().includes(search.toLowerCase())
  );

  function handleConfirm() {
    if (selected) { onSelect(selected); onClose(); }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.5)",
          zIndex: 1000, backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 90vw)", maxHeight: "80vh",
          backgroundColor: "white", borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          zIndex: 1001, display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>Biblioteca de mídia</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar imagens…"
              style={{ width: "100%", padding: "8px 10px 8px 32px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>Carregando…</div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>
              <ImageIcon size={32} style={{ margin: "0 auto 8px", display: "block" }} />
              <p>{search ? "Nenhuma imagem encontrada." : "Nenhuma imagem na biblioteca."}</p>
              <p style={{ fontSize: "0.8125rem", marginTop: "4px" }}>Faça upload na página Mídias para adicionar imagens.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
              {images.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.fileUrl)}
                  style={{
                    border: `2px solid ${selected === item.fileUrl ? "#6366f1" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "none",
                    padding: 0,
                    position: "relative",
                    outline: "none",
                  }}
                  title={item.originalName}
                >
                  <img
                    src={item.fileUrl}
                    alt={item.altText || item.originalName}
                    loading="lazy"
                    style={{ width: "100%", height: "100px", objectFit: "cover", display: "block" }}
                  />
                  {selected === item.fileUrl && (
                    <div style={{
                      position: "absolute", inset: 0, backgroundColor: "rgba(99,102,241,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div style={{ padding: "6px 8px", backgroundColor: "white", borderTop: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: "0.6875rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.originalName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px", justifyContent: "flex-end", flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", color: "#334155", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            style={{ padding: "9px 20px", border: "none", borderRadius: "8px", backgroundColor: "#6366f1", color: "white", fontWeight: 500, fontSize: "0.9375rem", cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.5 }}
          >
            Usar imagem
          </button>
        </div>
      </div>
    </>
  );
}
