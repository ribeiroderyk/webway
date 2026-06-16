import type { Block } from "@/types";

// Lightweight preview of each block type for use inside the editor canvas
export function BlockPreview({ block }: { block: Block }) {
  const props = block.props as Record<string, unknown>;

  switch (block.type) {
    case "hero":
      return (
        <div style={{ padding: "48px 32px", backgroundColor: (props.bgColor as string) || "#f8fafc", textAlign: (props.alignment as string) === "center" ? "center" : "left" }}>
          {!!props.eyebrow && (
            <p style={{ color: "#6366f1", fontWeight: 600, fontSize: "0.875rem", marginBottom: "8px" }}>{props.eyebrow as string}</p>
          )}
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
            {(props.headline as string) || "Título principal"}
          </h1>
          {!!props.subheadline && (
            <p style={{ fontSize: "1.125rem", color: "#475569", marginBottom: "20px" }}>{props.subheadline as string}</p>
          )}
          {!!props.buttonText && (
            <span style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "#6366f1", color: "white", borderRadius: "8px", fontWeight: 500, fontSize: "0.9375rem" }}>
              {props.buttonText as string}
            </span>
          )}
        </div>
      );

    case "text":
      return (
        <div style={{ padding: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>{(props.title as string) || "Título"}</h2>
          <p style={{ color: "#475569", lineHeight: 1.7 }}>{(props.content as string) || "Conteúdo do bloco de texto…"}</p>
        </div>
      );

    case "image":
      return (
        <div style={{ padding: "16px 32px" }}>
          {props.imageUrl ? (
            <img src={props.imageUrl as string} alt={(props.altText as string) || ""} style={{ width: "100%", borderRadius: "8px" }} />
          ) : (
            <div style={{ backgroundColor: "#f1f5f9", borderRadius: "8px", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              Imagem não definida
            </div>
          )}
        </div>
      );

    case "feature-grid": {
      const features = (props.features as Array<{ title: string; description: string }>) ?? [];
      return (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", color: "#0f172a", marginBottom: "24px" }}>{(props.title as string) || "Funcionalidades"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {(features.length ? features : [{ title: "Item 1", description: "Descrição" }, { title: "Item 2", description: "Descrição" }, { title: "Item 3", description: "Descrição" }]).map((f, i) => (
              <div key={i} style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                <h3 style={{ fontWeight: 600, color: "#0f172a", marginBottom: "4px", fontSize: "0.9375rem" }}>{f.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "cta":
      return (
        <div style={{ padding: "40px 32px", backgroundColor: (props.bgColor as string) || "#6366f1", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "8px" }}>{(props.title as string) || "Call to Action"}</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "20px" }}>{props.description as string}</p>
          {!!props.buttonText && (
            <span style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "white", color: (props.bgColor as string) || "#6366f1", borderRadius: "8px", fontWeight: 600 }}>
              {props.buttonText as string}
            </span>
          )}
        </div>
      );

    case "contact":
      return (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>{(props.title as string) || "Contato"}</h2>
          {!!props.email && <p style={{ color: "#475569", fontSize: "0.9375rem" }}>✉ {props.email as string}</p>}
          {!!props.phone && <p style={{ color: "#475569", fontSize: "0.9375rem" }}>{props.phone as string}</p>}
        </div>
      );

    case "testimonials": {
      const testimonials = (props.testimonials as Array<{ name: string; content: string }>) ?? [];
      return (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", color: "#0f172a", marginBottom: "24px" }}>{(props.title as string) || "Depoimentos"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {(testimonials.length ? testimonials.slice(0, 2) : [{ name: "Cliente", content: "Depoimento aqui…" }]).map((t, i) => (
              <div key={i} style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                <p style={{ color: "#334155", fontStyle: "italic", marginBottom: "8px" }}>"{t.content}"</p>
                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "faq": {
      const items = (props.items as Array<{ question: string }>) ?? [];
      return (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center", color: "#0f172a", marginBottom: "24px" }}>{(props.title as string) || "Perguntas Frequentes"}</h2>
          {(items.length ? items.slice(0, 3) : [{ question: "Pergunta de exemplo?" }]).map((item, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.9375rem" }}>{item.question}</p>
            </div>
          ))}
        </div>
      );
    }

    default:
      return (
        <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          [{block.type}]
        </div>
      );
  }
}
