"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const body = { email: data.get("email"), password: data.get("password") };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Erro ao entrar. Tente novamente.");
        return;
      }

      router.push("/app/dashboard");
    } catch {
      setError("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        padding: "32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
        Entrar na sua conta
      </h1>
      <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "0.9375rem" }}>
        Não tem conta?{" "}
        <Link href="/signup" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>
          Criar grátis
        </Link>
      </p>

      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            borderRadius: "8px",
            padding: "12px 14px",
            fontSize: "0.875rem",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label htmlFor="email" style={labelStyle}>E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@exemplo.com"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" style={labelStyle}>Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            style={inputStyle}
          />
          <div style={{ textAlign: "right", marginTop: "6px" }}>
            <Link href="/forgot-password" style={{ fontSize: "0.8125rem", color: "#6366f1", textDecoration: "none" }}>
              Esqueci a senha
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...btnPrimaryStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
};

const btnPrimaryStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px",
  backgroundColor: "#6366f1",
  color: "white",
  fontWeight: 600,
  fontSize: "0.9375rem",
  border: "none",
  borderRadius: "8px",
  marginTop: "4px",
};
