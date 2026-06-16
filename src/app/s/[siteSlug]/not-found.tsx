// Custom 404 for public site pages — shows site identity when site exists
export default function SiteNotFound() {
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
      <p style={{ fontSize: "5rem", fontWeight: 800, color: "#e2e8f0", lineHeight: 1, marginBottom: "16px" }}>404</p>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
        Página não encontrada
      </h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>
        Esta página não existe ou não está publicada.
      </p>
      <a href="javascript:history.back()" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>
        ← Voltar
      </a>
    </div>
  );
}
