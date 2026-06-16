"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Monitor } from "lucide-react";

type Tab = "profile" | "security";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface Session {
  id: string;
  createdAt: string;
  userAgent: string | null;
}

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState<UserData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setUser({ id: json.data.user.id, name: json.data.user.name, email: json.data.user.email });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#94a3b8" }}>Carregando…</div>;

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a" }}>Minha conta</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "32px" }}>
        {(["profile", "security"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { profile: "Perfil", security: "Segurança" };
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

      {tab === "profile" && user && <ProfileTab user={user} onUpdate={setUser} />}
      {tab === "security" && <SecurityTab />}
    </div>
  );
}

function ProfileTab({ user, onUpdate }: { user: UserData; onUpdate: (u: UserData) => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const json = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: json.error ?? "Erro ao salvar." }); return; }
      onUpdate({ ...user, name, email });
      setMessage({ type: "success", text: "Perfil atualizado!" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  const initials = name.split(" ").slice(0, 2).map((n) => n.charAt(0)).join("").toUpperCase();

  return (
    <Card title="Informações do perfil">
      {message && <AlertMsg type={message.type}>{message.text}</AlertMsg>}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#6366f1", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700 }}>
          {initials}
        </div>
        <div>
          <p style={{ fontWeight: 600, color: "#0f172a" }}>{name}</p>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>{email}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Row label="Nome completo">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </Row>
        <Row label="E-mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn saving={saving} onClick={handleSave} />
        </div>
      </div>
    </Card>
  );
}

function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword() {
    if (next !== confirm) { setMessage({ type: "error", text: "As senhas não coincidem." }); return; }
    if (next.length < 8) { setMessage({ type: "error", text: "A nova senha deve ter ao menos 8 caracteres." }); return; }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const json = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: json.error ?? "Erro ao alterar senha." }); return; }
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Alterar senha">
      {message && <AlertMsg type={message.type}>{message.text}</AlertMsg>}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Row label="Senha atual">
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" style={inputStyle} />
        </Row>
        <Row label="Nova senha">
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" placeholder="Mínimo 8 caracteres" style={inputStyle} />
        </Row>
        <Row label="Confirmar nova senha">
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" style={inputStyle} />
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn saving={saving} onClick={handleChangePassword} label="Alterar senha" />
        </div>
      </div>
    </Card>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ saving, onClick, label = "Salvar" }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{ padding: "9px 24px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.9375rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
    >
      {saving ? "Salvando…" : label}
    </button>
  );
}

function AlertMsg({ type, children }: { type: "success" | "error"; children: React.ReactNode }) {
  const c = type === "success"
    ? { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" }
    : { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" };
  return (
    <div style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: "8px", padding: "10px 14px", fontSize: "0.875rem", marginBottom: "16px" }}>
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
};
