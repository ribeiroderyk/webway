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
    case "hero": {
      const hasImage = !!(props.imageUrl as string);
      const isCenter = (props.alignment as string) === "center";
      return (
        <section
          style={{
            backgroundColor: (props.bgColor as string) || "transparent",
            padding: "80px 24px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: hasImage ? "grid" : "block",
              gridTemplateColumns: hasImage ? "1fr 1fr" : undefined,
              gap: hasImage ? "48px" : undefined,
              alignItems: hasImage ? "center" : undefined,
              textAlign: !hasImage && isCenter ? "center" : "left",
            }}
          >
            <div>
              {!!props.eyebrow && (
                <p style={{ color: "#6366f1", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>
                  {props.eyebrow as string}
                </p>
              )}
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "24px", lineHeight: 1.15 }}>
                {props.headline as string}
              </h1>
              {!!props.subheadline && (
                <p style={{ fontSize: "1.125rem", color: "#475569", marginBottom: "32px", lineHeight: 1.6 }}>
                  {props.subheadline as string}
                </p>
              )}
              {!!props.buttonText && (
                <a
                  href={props.buttonUrl as string}
                  style={{
                    display: "inline-block",
                    padding: "12px 28px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "1rem",
                  }}
                >
                  {props.buttonText as string}
                </a>
              )}
            </div>
            {hasImage && (
              <div>
                <img
                  src={props.imageUrl as string}
                  alt={(props.headline as string) ?? ""}
                  loading="eager"
                  style={{ width: "100%", borderRadius: "16px", objectFit: "cover", maxHeight: "480px" }}
                />
              </div>
            )}
          </div>
        </section>
      );
    }

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
          {!!props.imageUrl && (
            <img
              src={props.imageUrl as string}
              alt={(props.altText as string) || ""}
              loading="lazy"
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
          {!!props.caption && (
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
          {!!props.description && (
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
          {!!props.buttonText && (
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
          {!!props.description && (
            <p style={{ color: "#475569", marginBottom: "32px" }}>{props.description as string}</p>
          )}
          {!!props.email && (
            <p style={{ marginBottom: "8px" }}>
              <a href={`mailto:${props.email}`} style={{ color: "#6366f1" }}>{props.email as string}</a>
            </p>
          )}
          {!!props.phone && <p style={{ marginBottom: "8px" }}>{props.phone as string}</p>}
          {!!props.address && <p>{props.address as string}</p>}
        </section>
      );

    case "testimonials": {
      const testimonials = (props.testimonials as Array<{ name: string; role: string; content: string; avatarUrl?: string }>) ?? [];
      return (
        <section style={{ padding: "64px 24px", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>
            {props.title as string}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
                <p style={{ color: "#334155", marginBottom: "20px", fontStyle: "italic", flex: 1, lineHeight: 1.6 }}>"{t.content}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem", fontWeight: 700, color: "#6366f1" }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{t.name}</p>
                    <p style={{ color: "#64748b", fontSize: "0.8125rem" }}>{t.role}</p>
                  </div>
                </div>
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
