import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "24px",
        backgroundColor: "#f8fafc",
      }}
    >
      <p style={{ fontSize: "6rem", fontWeight: 800, color: "#e2e8f0", lineHeight: 1, marginBottom: "16px" }}>404</p>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
        Página não encontrada
      </h1>
      <p style={{ color: "#64748b", marginBottom: "32px", maxWidth: "380px" }}>
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 24px",
          backgroundColor: "#6366f1",
          color: "white",
          borderRadius: "10px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Ir para início
      </Link>
    </div>
  );
}
