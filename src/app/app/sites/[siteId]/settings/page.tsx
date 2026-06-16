"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface SiteData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  primaryColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  status: string;
  googleSiteVerification: string | null;
}

type Tab = "general" | "appearance" | "advanced";

export default function SettingsPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("general");
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/sites/${siteId}`)
      .then((r) => r.json())
      .then((json) => setSite(json.data))
      .finally(() => setLoading(false));
  }, [siteId]);

  async function handleSave(payload: Partial<SiteData>) {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Erro ao salvar."); return; }
      setSite(json.data);
      setSuccess("Configurações salvas!");
      setTimeout(() => setSuccess(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== site?.name) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (res.ok) router.push("/app/sites");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div style={{ padding: "32px", color: "#94a3b8" }}>Carregando…</div>;
  if (!site) return null;

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Configurações</h1>
        <p style={{ color: "#64748b", marginTop: "4px" }}>{site.name}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid #e2e8f0", marginBottom: "32px" }}>
        {(["general", "appearance", "advanced"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { general: "Geral", appearance: "Aparência", advanced: "Avançado" };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderBottom: `2px solid ${tab === t ? "#6366f1" : "transparent"}`,
                backgroundColor: "transparent",
                color: tab === t ? "#6366f1" : "#64748b",
                fontWeight: tab === t ? 600 : 400,
                fontSize: "0.9375rem",
                cursor: "pointer",
                marginBottom: "-1px",
              }}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {/* General tab */}
      {tab === "general" && (
        <GeneralForm site={site} saving={saving} onSave={handleSave} />
      )}

      {/* Appearance tab */}
      {tab === "appearance" && (
        <AppearanceForm site={site} saving={saving} onSave={handleSave} />
      )}

      {/* Advanced tab */}
      {tab === "advanced" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Google verification */}
          <FormCard title="Verificação Google Search Console">
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "12px" }}>
              Cole o valor da tag meta de verificação do Google Search Console.
            </p>
            <FormRow label="Meta tag de verificação">
              <Input
                defaultValue={site.googleSiteVerification ?? ""}
                placeholder="google-site-verification=xxxxxxxx"
                onBlur={(v) => handleSave({ googleSiteVerification: v || null })}
              />
            </FormRow>
          </FormCard>

          {/* Danger zone */}
          <div style={{ border: "1px solid #fecaca", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <AlertTriangle size={18} color="#ef4444" />
              <h3 style={{ fontWeight: 600, color: "#dc2626", fontSize: "1rem" }}>Zona de perigo</h3>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "16px" }}>
              A exclusão do site é permanente e não pode ser desfeita. Todos os dados (páginas, posts, mídias) serão removidos.
            </p>
            <p style={{ fontSize: "0.875rem", color: "#374151", marginBottom: "8px" }}>
              Digite <strong>{site.name}</strong> para confirmar:
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={site.name}
                style={{ flex: 1, padding: "9px 12px", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "0.9375rem", outline: "none" }}
              />
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== site.name || deleting}
                style={{
                  padding: "9px 20px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: deleteConfirm !== site.name || deleting ? "not-allowed" : "pointer",
                  opacity: deleteConfirm !== site.name || deleting ? 0.5 : 1,
                }}
              >
                {deleting ? "Excluindo…" : "Excluir site"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GeneralForm({ site, saving, onSave }: { site: SiteData; saving: boolean; onSave: (p: Partial<SiteData>) => void }) {
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description ?? "");
  const [language, setLanguage] = useState(site.language);

  return (
    <FormCard title="Informações gerais">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormRow label="Nome do site">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </FormRow>
        <FormRow label="Slug (URL)">
          <input
            type="text"
            defaultValue={site.slug}
            disabled
            style={{ ...inputStyle, backgroundColor: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
          />
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>O slug não pode ser alterado após a criação.</p>
        </FormRow>
        <FormRow label="Descrição">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descrição breve do site para SEO…"
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </FormRow>
        <FormRow label="Idioma principal">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
          </select>
        </FormRow>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn saving={saving} onClick={() => onSave({ name, description: description || null, language })} />
        </div>
      </div>
    </FormCard>
  );
}

function AppearanceForm({ site, saving, onSave }: { site: SiteData; saving: boolean; onSave: (p: Partial<SiteData>) => void }) {
  const [logoUrl, setLogoUrl] = useState(site.logoUrl ?? "");
  const [faviconUrl, setFaviconUrl] = useState(site.faviconUrl ?? "");
  const [primaryColor, setPrimaryColor] = useState(site.primaryColor);

  return (
    <FormCard title="Aparência">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormRow label="URL do logotipo">
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://…"
            style={inputStyle}
          />
          {logoUrl && <img src={logoUrl} alt="Logo preview" style={{ height: "40px", marginTop: "8px", borderRadius: "6px" }} />}
        </FormRow>
        <FormRow label="URL do favicon">
          <input
            type="text"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
            placeholder="https://…"
            style={inputStyle}
          />
        </FormRow>
        <FormRow label="Cor primária">
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer", padding: "2px" }} />
            <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#6366f1" style={{ ...inputStyle, width: "140px" }} />
          </div>
        </FormRow>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn saving={saving} onClick={() => onSave({ logoUrl: logoUrl || null, faviconUrl: faviconUrl || null, primaryColor })} />
        </div>
      </div>
    </FormCard>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ defaultValue, placeholder, onBlur }: { defaultValue?: string; placeholder?: string; onBlur?: (v: string) => void }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onBlur={(e) => onBlur?.(e.target.value)}
      style={inputStyle}
    />
  );
}

function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{
        padding: "9px 24px",
        backgroundColor: "#6366f1",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "0.9375rem",
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.7 : 1,
      }}
    >
      {saving ? "Salvando…" : "Salvar"}
    </button>
  );
}

function Alert({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  const colors = {
    error: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
  };
  const c = colors[type];
  return (
    <div style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: "8px", padding: "10px 14px", fontSize: "0.875rem", marginBottom: "20px" }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};
