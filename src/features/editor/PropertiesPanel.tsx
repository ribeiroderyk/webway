"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { Block } from "@/types";
import { MediaPickerModal } from "./MediaPickerModal";

interface PropertiesPanelProps {
  block: Block | null;
  siteId: string;
  onChange: (props: Record<string, unknown>) => void;
}

export function PropertiesPanel({ block, siteId, onChange }: PropertiesPanelProps) {
  const [pickerTarget, setPickerTarget] = useState<null | { key: string; nested?: { arrayKey: string; index: number; field: string } }>(null);
  if (!block) {
    return (
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          backgroundColor: "white",
          borderLeft: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          padding: "24px",
          textAlign: "center",
          fontSize: "0.875rem",
        }}
      >
        Selecione um bloco no canvas para editar suas propriedades.
      </div>
    );
  }

  const props = block.props as Record<string, unknown>;

  function update(key: string, value: unknown) {
    onChange({ ...props, [key]: value });
  }

  function updateNestedArray(key: string, index: number, field: string, value: string) {
    const arr = (props[key] as Record<string, unknown>[]) ?? [];
    const updated = arr.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ ...props, [key]: updated });
  }

  function addArrayItem(key: string, template: Record<string, string>) {
    const arr = (props[key] as Record<string, unknown>[]) ?? [];
    onChange({ ...props, [key]: [...arr, template] });
  }

  function removeArrayItem(key: string, index: number) {
    const arr = (props[key] as Record<string, unknown>[]) ?? [];
    onChange({ ...props, [key]: arr.filter((_, i) => i !== index) });
  }

  return (
    <div
      style={{
        width: "280px",
        flexShrink: 0,
        backgroundColor: "white",
        borderLeft: "1px solid #e2e8f0",
        overflowY: "auto",
        padding: "16px",
      }}
    >
      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "16px" }}>
        Propriedades
      </p>

      {block.type === "hero" && (
        <Fields>
          <Field label="Eyebrow">
            <Input value={(props.eyebrow as string) ?? ""} onChange={(v) => update("eyebrow", v)} placeholder="Novidade" />
          </Field>
          <Field label="Título *">
            <Input value={(props.headline as string) ?? ""} onChange={(v) => update("headline", v)} placeholder="Seu título aqui" />
          </Field>
          <Field label="Subtítulo">
            <Textarea value={(props.subheadline as string) ?? ""} onChange={(v) => update("subheadline", v)} placeholder="Descrição breve…" />
          </Field>
          <Field label="Texto do botão">
            <Input value={(props.buttonText as string) ?? ""} onChange={(v) => update("buttonText", v)} placeholder="Começar agora" />
          </Field>
          <Field label="URL do botão">
            <Input value={(props.buttonUrl as string) ?? ""} onChange={(v) => update("buttonUrl", v)} placeholder="/contato" />
          </Field>
          <Field label="Alinhamento">
            <Select
              value={(props.alignment as string) ?? "left"}
              onChange={(v) => update("alignment", v)}
              options={[{ value: "left", label: "Esquerda" }, { value: "center", label: "Centro" }]}
            />
          </Field>
          <Field label="Cor de fundo">
            <Input value={(props.bgColor as string) ?? "#f8fafc"} onChange={(v) => update("bgColor", v)} placeholder="#f8fafc" />
          </Field>
          <Field label="Imagem (opcional)">
            <ImageInput
              value={(props.imageUrl as string) ?? ""}
              onChange={(v) => update("imageUrl", v)}
              onPickFromLibrary={() => setPickerTarget({ key: "imageUrl" })}
            />
          </Field>
        </Fields>
      )}

      {block.type === "text" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} placeholder="Título" />
          </Field>
          <Field label="Conteúdo">
            <Textarea value={(props.content as string) ?? ""} onChange={(v) => update("content", v)} placeholder="Seu texto aqui…" rows={6} />
          </Field>
        </Fields>
      )}

      {block.type === "image" && (
        <Fields>
          <Field label="URL da imagem">
            <ImageInput
              value={(props.imageUrl as string) ?? ""}
              onChange={(v) => update("imageUrl", v)}
              onPickFromLibrary={() => setPickerTarget({ key: "imageUrl" })}
            />
          </Field>
          <Field label="Texto alternativo">
            <Input value={(props.altText as string) ?? ""} onChange={(v) => update("altText", v)} placeholder="Descrição da imagem" />
          </Field>
          <Field label="Legenda">
            <Input value={(props.caption as string) ?? ""} onChange={(v) => update("caption", v)} placeholder="Legenda opcional" />
          </Field>
        </Fields>
      )}

      {block.type === "feature-grid" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} placeholder="Funcionalidades" />
          </Field>
          <Field label="Subtítulo">
            <Textarea value={(props.description as string) ?? ""} onChange={(v) => update("description", v)} />
          </Field>
          <Field label="Itens">
            {((props.features as Array<{ title: string; description: string }>) ?? []).map((f, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}>
                <Input
                  value={f.title}
                  onChange={(v) => updateNestedArray("features", i, "title", v)}
                  placeholder="Título do item"
                />
                <div style={{ marginTop: "6px" }}>
                  <Textarea
                    value={f.description}
                    onChange={(v) => updateNestedArray("features", i, "description", v)}
                    placeholder="Descrição"
                    rows={2}
                  />
                </div>
                <button
                  onClick={() => removeArrayItem("features", i)}
                  style={{ fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginTop: "4px" }}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("features", { title: "", description: "" })}
              style={{ fontSize: "0.8125rem", color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}
            >
              + Adicionar item
            </button>
          </Field>
        </Fields>
      )}

      {block.type === "cta" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} />
          </Field>
          <Field label="Descrição">
            <Textarea value={(props.description as string) ?? ""} onChange={(v) => update("description", v)} />
          </Field>
          <Field label="Texto do botão">
            <Input value={(props.buttonText as string) ?? ""} onChange={(v) => update("buttonText", v)} />
          </Field>
          <Field label="URL do botão">
            <Input value={(props.buttonUrl as string) ?? ""} onChange={(v) => update("buttonUrl", v)} />
          </Field>
          <Field label="Cor de fundo">
            <Input value={(props.bgColor as string) ?? "#6366f1"} onChange={(v) => update("bgColor", v)} placeholder="#6366f1" />
          </Field>
        </Fields>
      )}

      {block.type === "contact" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} />
          </Field>
          <Field label="Descrição">
            <Textarea value={(props.description as string) ?? ""} onChange={(v) => update("description", v)} />
          </Field>
          <Field label="E-mail">
            <Input value={(props.email as string) ?? ""} onChange={(v) => update("email", v)} placeholder="contato@empresa.com" />
          </Field>
          <Field label="Telefone">
            <Input value={(props.phone as string) ?? ""} onChange={(v) => update("phone", v)} />
          </Field>
          <Field label="Endereço">
            <Input value={(props.address as string) ?? ""} onChange={(v) => update("address", v)} />
          </Field>
        </Fields>
      )}

      {block.type === "faq" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} placeholder="Perguntas Frequentes" />
          </Field>
          <Field label="Perguntas">
            {((props.items as Array<{ question: string; answer: string }>) ?? []).map((item, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}>
                <Input
                  value={item.question}
                  onChange={(v) => updateNestedArray("items", i, "question", v)}
                  placeholder="Pergunta"
                />
                <div style={{ marginTop: "6px" }}>
                  <Textarea
                    value={item.answer}
                    onChange={(v) => updateNestedArray("items", i, "answer", v)}
                    placeholder="Resposta"
                    rows={3}
                  />
                </div>
                <button
                  onClick={() => removeArrayItem("items", i)}
                  style={{ fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginTop: "4px" }}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("items", { question: "", answer: "" })}
              style={{ fontSize: "0.8125rem", color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}
            >
              + Adicionar pergunta
            </button>
          </Field>
        </Fields>
      )}

      {block.type === "testimonials" && (
        <Fields>
          <Field label="Título">
            <Input value={(props.title as string) ?? ""} onChange={(v) => update("title", v)} placeholder="Depoimentos" />
          </Field>
          <Field label="Depoimentos">
            {((props.testimonials as Array<{ name: string; role: string; content: string; avatarUrl?: string }>) ?? []).map((t, i) => (
              <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}>
                <Input value={t.name} onChange={(v) => updateNestedArray("testimonials", i, "name", v)} placeholder="Nome" />
                <div style={{ marginTop: "6px" }}>
                  <Input value={t.role} onChange={(v) => updateNestedArray("testimonials", i, "role", v)} placeholder="Cargo / Empresa" />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <Textarea value={t.content} onChange={(v) => updateNestedArray("testimonials", i, "content", v)} placeholder="Depoimento…" rows={3} />
                </div>
                <div style={{ marginTop: "6px" }}>
                  <ImageInput
                    value={t.avatarUrl ?? ""}
                    onChange={(v) => updateNestedArray("testimonials", i, "avatarUrl", v)}
                    onPickFromLibrary={() => setPickerTarget({ key: "testimonials", nested: { arrayKey: "testimonials", index: i, field: "avatarUrl" } })}
                    placeholder="URL do avatar (opcional)"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem("testimonials", i)}
                  style={{ fontSize: "0.75rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginTop: "4px" }}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("testimonials", { name: "", role: "", content: "", avatarUrl: "" })}
              style={{ fontSize: "0.8125rem", color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}
            >
              + Adicionar depoimento
            </button>
          </Field>
        </Fields>
      )}

      {/* Media picker modal */}
      {pickerTarget && (
        <MediaPickerModal
          siteId={siteId}
          onClose={() => setPickerTarget(null)}
          onSelect={(url) => {
            if (pickerTarget.nested) {
              const { arrayKey, index, field } = pickerTarget.nested;
              updateNestedArray(arrayKey, index, field, url);
            } else {
              update(pickerTarget.key, url);
            }
            setPickerTarget(null);
          }}
        />
      )}
    </div>
  );
}

function Fields({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#374151", marginBottom: "5px" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "7px 10px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "0.875rem",
        color: "#0f172a",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        padding: "7px 10px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "0.875rem",
        color: "#0f172a",
        outline: "none",
        boxSizing: "border-box",
        resize: "vertical",
        lineHeight: 1.5,
      }}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "7px 10px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "0.875rem",
        color: "#0f172a",
        outline: "none",
        boxSizing: "border-box",
        backgroundColor: "white",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function ImageInput({
  value,
  onChange,
  onPickFromLibrary,
  placeholder = "https://…",
}: {
  value: string;
  onChange: (v: string) => void;
  onPickFromLibrary: () => void;
  placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: "7px", fontSize: "0.875rem", color: "#0f172a", outline: "none", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={onPickFromLibrary}
        style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "5px 10px", border: "1px solid #e2e8f0", borderRadius: "6px",
          backgroundColor: "#f8fafc", color: "#475569", fontSize: "0.75rem",
          fontWeight: 500, cursor: "pointer", alignSelf: "flex-start",
        }}
      >
        <ImageIcon size={13} /> Escolher da biblioteca
      </button>
      {value && (
        <img src={value} alt="" style={{ width: "100%", maxHeight: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
      )}
    </div>
  );
}
