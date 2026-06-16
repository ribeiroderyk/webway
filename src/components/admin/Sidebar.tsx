"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  FileText,
  PenSquare,
  Image,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SiteNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  siteId?: string;
  siteName?: string;
}

const mainNav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/sites", label: "Sites", icon: Globe },
];

function getSiteNav(siteId: string): SiteNavItem[] {
  return [
    { href: `/app/sites/${siteId}/pages`, label: "Páginas", icon: FileText },
    { href: `/app/sites/${siteId}/posts`, label: "Blog", icon: PenSquare },
    { href: `/app/sites/${siteId}/media`, label: "Mídia", icon: Image },
    { href: `/app/sites/${siteId}/seo`, label: "SEO", icon: Search },
    { href: `/app/sites/${siteId}/settings`, label: "Configurações", icon: Settings },
  ];
}

export function Sidebar({ siteId, siteName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const siteNav = siteId ? getSiteNav(siteId) : [];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "260px",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#cbd5e1",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 200ms ease",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 20px" : "0 24px",
          borderBottom: "1px solid #1e293b",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#6366f1", whiteSpace: "nowrap" }}>
          {collapsed ? "W" : "Web Way"}
        </span>
      </div>

      {/* Main nav */}
      <nav style={{ padding: "12px 8px", flex: 1 }}>
        <NavSection>
          {mainNav.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(item.href)}
              collapsed={collapsed}
            />
          ))}
        </NavSection>

        {siteNav.length > 0 && (
          <>
            {!collapsed && (
              <p style={{ padding: "8px 12px", fontSize: "0.75rem", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "8px" }}>
                {siteName ?? "Site"}
              </p>
            )}
            {collapsed && <div style={{ height: "16px" }} />}
            <NavSection>
              {siteNav.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.href)}
                  collapsed={collapsed}
                />
              ))}
            </NavSection>
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          position: "absolute",
          top: "50%",
          right: "-12px",
          transform: "translateY(-50%)",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}

function NavSection({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>{children}</div>;
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: collapsed ? "10px 20px" : "10px 12px",
        borderRadius: "8px",
        fontSize: "0.9375rem",
        fontWeight: active ? 600 : 400,
        color: active ? "#fff" : "#94a3b8",
        backgroundColor: active ? "#6366f1" : "transparent",
        textDecoration: "none",
        transition: "background-color 150ms, color 150ms",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
