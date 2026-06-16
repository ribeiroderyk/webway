"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

interface TopbarProps {
  user: {
    name: string;
    email: string;
  };
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function Topbar({ user, breadcrumbs }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
      }}
    >
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <ol style={{ display: "flex", alignItems: "center", gap: "6px", listStyle: "none", margin: 0, padding: 0 }}>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} style={{ color: "#64748b", fontSize: "0.9375rem", textDecoration: "none" }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: "#0f172a", fontSize: "0.9375rem", fontWeight: 500 }}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        ) : null}
      </nav>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          aria-label="Notificações"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "8px", borderRadius: "8px" }}
        >
          <Bell size={20} />
        </button>

        {/* User dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#6366f1",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8125rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#0f172a" }}>{user.name.split(" ")[0]}</span>
            <ChevronDown size={16} color="#64748b" />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                minWidth: "200px",
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#0f172a" }}>{user.name}</p>
                <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>{user.email}</p>
              </div>
              <div style={{ padding: "4px" }}>
                <DropdownItem href="/app/account" icon={User} label="Meu perfil" />
                <DropdownItem href="/app/workspace" icon={Settings} label="Workspace" />
                <div style={{ height: "1px", backgroundColor: "#f1f5f9", margin: "4px 0" }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "0.9375rem",
                    color: "#ef4444",
                    textAlign: "left",
                  }}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "0.9375rem",
        color: "#334155",
        textDecoration: "none",
      }}
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}
