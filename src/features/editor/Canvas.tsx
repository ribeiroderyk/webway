"use client";

import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import type { Block } from "@/types";
import { blockRegistry } from "./blocks/registry";
import { BlockPreview } from "./BlockPreview";

interface CanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
  onAdd: (type: string) => void;
}

export function Canvas({ blocks, selectedBlockId, onSelect, onMove, onDelete, onAdd }: CanvasProps) {
  if (blocks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "16px",
          color: "#94a3b8",
          padding: "48px",
        }}
      >
        <p style={{ fontSize: "1rem" }}>Nenhum bloco adicionado ainda.</p>
        <p style={{ fontSize: "0.875rem", textAlign: "center" }}>
          Adicione blocos pela biblioteca à esquerda para começar a construir sua página.
        </p>
      </div>
    );
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const def = blockRegistry[block.type];
        const isSelected = block.id === selectedBlockId;

        return (
          <div
            key={block.id}
            onClick={() => onSelect(block.id)}
            style={{
              position: "relative",
              outline: isSelected ? "2px solid #6366f1" : "2px solid transparent",
              cursor: "pointer",
              transition: "outline-color 150ms",
            }}
          >
            {/* Block toolbar (visible on hover/select) */}
            {isSelected && (
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  display: "flex",
                  gap: "4px",
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  style={{
                    backgroundColor: "#6366f1",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    marginRight: "4px",
                  }}
                >
                  {def?.label ?? block.type}
                </span>
                <ToolbarBtn
                  icon={ArrowUp}
                  title="Mover para cima"
                  disabled={index === 0}
                  onClick={() => onMove(block.id, "up")}
                />
                <ToolbarBtn
                  icon={ArrowDown}
                  title="Mover para baixo"
                  disabled={index === blocks.length - 1}
                  onClick={() => onMove(block.id, "down")}
                />
                <ToolbarBtn
                  icon={Trash2}
                  title="Remover bloco"
                  onClick={() => onDelete(block.id)}
                  danger
                />
              </div>
            )}

            <BlockPreview block={block} />
          </div>
        );
      })}
    </div>
  );
}

function ToolbarBtn({
  icon: Icon,
  title,
  onClick,
  disabled,
  danger,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: danger ? "#ef4444" : "#334155",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon size={13} />
    </button>
  );
}
