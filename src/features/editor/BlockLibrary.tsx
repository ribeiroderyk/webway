"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { blockCategories, getBlocksByCategory, blockRegistry } from "./blocks/registry";

interface BlockLibraryProps {
  onAddBlock: (type: string) => void;
}

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredBlocks = Object.values(blockRegistry).filter((b) => {
    const matchSearch =
      !search ||
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "all" || b.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div
      style={{
        width: "240px",
        flexShrink: 0,
        backgroundColor: "white",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
      }}
    >
      <div style={{ padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0f172a", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Blocos
        </p>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar bloco…"
            style={{
              width: "100%",
              padding: "7px 8px 7px 28px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.875rem",
              color: "#334155",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: "4px", padding: "8px 12px", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" }}>
        <CategoryChip
          label="Todos"
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        />
        {blockCategories.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.label}
            active={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>

      {/* Block list */}
      <div style={{ overflowY: "auto", flex: 1, padding: "8px" }}>
        {filteredBlocks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.875rem", padding: "24px 0" }}>
            Nenhum bloco encontrado.
          </p>
        ) : (
          filteredBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <button
                key={block.type}
                onClick={() => onAddBlock(block.type)}
                title={block.description}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: "2px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} color="#6366f1" />
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#0f172a" }}>{block.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{block.description}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px",
        borderRadius: "9999px",
        border: "1px solid",
        borderColor: active ? "#6366f1" : "#e2e8f0",
        backgroundColor: active ? "#ede9fe" : "transparent",
        color: active ? "#6366f1" : "#64748b",
        fontSize: "0.75rem",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
