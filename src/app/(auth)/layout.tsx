export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "#6366f1" }}>Web Way</span>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "0.9375rem" }}>
            A plataforma moderna para criar sites e blogs
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
