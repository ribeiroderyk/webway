import type { Block } from "@/types";

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8" }}>
        <p>Nenhum conteúdo publicado ainda.</p>
      </div>
    );
  }

  return (
    <div>
      {blocks.map((block) => (
        <PublicBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function PublicBlock({ block }: { block: Block }) {
  const props = block.props as Record<string, unknown>;

  switch (block.type) {
    case "hero":
      return (
        <section
          style={{
            padding: "80px 24px",
            textAlign: (props.alignment as string) === "center" ? "center" : "left",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {props.eyebrow && (
            <p style={{ color: "#6366f1", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>
              {props.eyebrow as string}
            </p>
          )}
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "24px" }}>
            {props.headline as string}
          </h1>
          {props.subheadline && (
            <p style={{ fontSize: "1.25rem", color: "#475569", marginBottom: "32px", maxWidth: "640px", margin: "0 auto 32px" }}>
              {props.subheadline as string}
            </p>
          )}
          {props.buttonText && (
            <a
              href={props.buttonUrl as string}
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#6366f1",
                color: "white",
                borderRadius: "8px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {props.buttonText as string}
            </a>
          )}
        </section>
      );

    case "text":
      return (
        <section style={{ padding: "48px 24px", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "16px" }}>
            {props.title as string}
          </h2>
          <p style={{ fontSize: "1.125rem", color: "#475569", lineHeight: 1.7 }}>
            {props.content as string}
          </p>
        </section>
      );

    case "image":
      return (
        <section style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          {props.imageUrl && (
            <img
              src={props.imageUrl as string}
              alt={(props.altText as string) || ""}
              loading="lazy"
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
          {props.caption && (
            <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginTop: "8px" }}>
              {props.caption as string}
            </p>
          )}
        </section>
      );

    case "feature-grid": {
      const features = (props.features as Array<{ title: string; description: string }>) ?? [];
      return (
        <section style={{ padding: "64px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, textAlign: "center", marginBottom: "16px" }}>
            {props.title as string}
          </h2>
          {props.description && (
            <p style={{ textAlign: "center", color: "#475569", marginBottom: "48px" }}>
              {props.description as string}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "#475569", fontSize: "0.9375rem" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "cta":
      return (
        <section
          style={{
            padding: "64px 24px",
            textAlign: "center",
            backgroundColor: (props.bgColor as string) || "#6366f1",
            color: "white",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>
            {props.title as string}
          </h2>
          <p style={{ fontSize: "1.125rem", marginBottom: "32px", opacity: 0.9 }}>
            {props.description as string}
          </p>
          {props.buttonText && (
            <a
              href={props.buttonUrl as string}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                backgroundColor: "white",
                color: (props.bgColor as string) || "#6366f1",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {props.buttonText as string}
            </a>
          )}
        </section>
      );

    case "contact":
      return (
        <section style={{ padding: "64px 24px", maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "16px" }}>
            {props.title as string}
          </h2>
          {props.description && (
            <p style={{ color: "#475569", marginBottom: "32px" }}>{props.description as string}</p>
          )}
          {props.email && (
            <p style={{ marginBottom: "8px" }}>
              <a href={`mailto:${props.email}`} style={{ color: "#6366f1" }}>{props.email as string}</a>
            </p>
          )}
          {props.phone && <p style={{ marginBottom: "8px" }}>{props.phone as string}</p>}
          {props.address && <p>{props.address as string}</p>}
        </section>
      );

    case "testimonials": {
      const testimonials = (props.testimonials as Array<{ name: string; role: string; content: string }>) ?? [];
      return (
        <section style={{ padding: "64px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>
            {props.title as string}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                <p style={{ color: "#334155", marginBottom: "16px", fontStyle: "italic" }}>"{t.content}"</p>
                <p style={{ fontWeight: 600 }}>{t.name}</p>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "faq": {
      const items = (props.items as Array<{ question: string; answer: string }>) ?? [];
      return (
        <section style={{ padding: "64px 24px", maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "48px", textAlign: "center" }}>
            {props.title as string}
          </h2>
          {items.map((item, i) => (
            <details key={i} style={{ borderBottom: "1px solid #e2e8f0", padding: "16px 0" }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{item.question}</summary>
              <p style={{ marginTop: "8px", color: "#475569" }}>{item.answer}</p>
            </details>
          ))}
        </section>
      );
    }

    default:
      return null;
  }
}
