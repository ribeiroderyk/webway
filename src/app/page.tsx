import Link from "next/link";
import type { Metadata } from "next";
import {
  Globe, PenSquare, Image, Search,
  Zap, Shield, Server, ArrowRight,
  Check, Twitter, Github, Code2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Web Way — A plataforma moderna para criar sites e blogs",
  description:
    "Crie sites profissionais com editor visual de blocos, blog integrado e SEO avançado. Sem código, sem limites.",
  openGraph: {
    title: "Web Way — A plataforma moderna para criar sites e blogs",
    description: "Crie sites profissionais com editor visual de blocos, blog integrado e SEO avançado.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter, Inter, sans-serif)", color: "#0f172a" }}>
      <Nav />
      <HeroSection />
      <SocialProof />
      <BenefitsSection />
      <FeaturesSection />
      <TechnicalSeoSection />
      <ComparisonSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f1f5f9",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
      }}
    >
      <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "#6366f1" }}>Web Way</span>
      <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <a href="#features" style={navLinkStyle}>Funcionalidades</a>
        <a href="#comparison" style={navLinkStyle}>Comparativo</a>
        <a href="#pricing" style={navLinkStyle}>Preços</a>
        <Link href="/login" style={{ ...navLinkStyle, color: "#6366f1", fontWeight: 500 }}>Entrar</Link>
        <Link
          href="/signup"
          style={{
            padding: "8px 20px",
            backgroundColor: "#6366f1",
            color: "white",
            borderRadius: "8px",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "0.9375rem",
          }}
        >
          Começar grátis
        </Link>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      style={{
        padding: "96px 24px 80px",
        textAlign: "center",
        background: "linear-gradient(135deg, #ede9fe 0%, #f0f9ff 50%, #f8fafc 100%)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", backgroundColor: "#ede9fe", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 500, color: "#7c3aed", marginBottom: "24px" }}>
          <Zap size={14} /> Novo · Editor visual de blocos v2
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-0.02em" }}>
          Crie sites profissionais
          <span style={{ display: "block", background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            sem escrever código
          </span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#475569", marginBottom: "40px", maxWidth: "580px", margin: "0 auto 40px" }}>
          Editor visual de blocos, blog integrado com rich text, SEO avançado e hospedagem incluída. Comece em minutos.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/signup"
            style={{ padding: "14px 32px", backgroundColor: "#6366f1", color: "white", borderRadius: "10px", fontWeight: 700, textDecoration: "none", fontSize: "1rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Criar conta grátis <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            style={{ padding: "14px 32px", border: "1px solid #e2e8f0", backgroundColor: "white", color: "#334155", borderRadius: "10px", fontWeight: 600, textDecoration: "none", fontSize: "1rem" }}
          >
            Já tenho conta
          </Link>
        </div>
        <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "#94a3b8" }}>
          Grátis para sempre · Sem cartão de crédito · Setup em 2 minutos
        </p>
      </div>
    </section>
  );
}

function SocialProof() {
  const metrics = [
    { value: "10k+", label: "Sites criados" },
    { value: "500k+", label: "Páginas publicadas" },
    { value: "99.9%", label: "Uptime garantido" },
    { value: "< 1s", label: "Tempo de carregamento" },
  ];
  return (
    <section style={{ borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "40px 24px", backgroundColor: "white" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "32px", textAlign: "center" }}>
        {metrics.map((m) => (
          <div key={m.label}>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: "#6366f1" }}>{m.value}</p>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "4px" }}>{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    { icon: Globe, title: "Editor visual de blocos", desc: "Arraste, solte e configure blocos pré-construídos. Veja o resultado em tempo real." },
    { icon: PenSquare, title: "Blog integrado", desc: "Editor rich text completo com formatação avançada, SEO por post e suporte a OpenGraph." },
    { icon: Image, title: "Gestão de mídia", desc: "Upload de imagens com otimização automática (WebP/AVIF), organização por site e reutilização fácil." },
    { icon: Search, title: "SEO nativo", desc: "Auditoria automática com score por página, JSON-LD, sitemap dinâmico e robots.txt por site." },
    { icon: Zap, title: "Performance extrema", desc: "Next.js 15 com SSR, ISR e otimização de imagens. Core Web Vitals verde por padrão." },
    { icon: Shield, title: "Segurança robusta", desc: "Sessões httpOnly, bcrypt, validação Zod em todas as entradas, headers de segurança pré-configurados." },
  ];

  return (
    <section id="features" style={{ padding: "96px 24px", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader
          label="Tudo o que você precisa"
          title="Um CMS moderno feito do jeito certo"
          desc="Sem plugins. Sem configurações complexas. Tudo que você precisa já está incluído."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "56px" }}>
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Icon size={22} color="#6366f1" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "8px" }}>{b.title}</h3>
                <p style={{ color: "#475569", fontSize: "0.9375rem", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section style={{ padding: "96px 24px", backgroundColor: "white" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader
          label="Editor de blocos"
          title="Construa páginas visualmente"
          desc="8 tipos de blocos prontos: Hero, Texto, Imagem, Grade de funcionalidades, CTA, Contato, FAQ e Depoimentos."
        />
        <div style={{ marginTop: "56px", backgroundColor: "#0f172a", borderRadius: "20px", padding: "32px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", gap: "16px", height: "480px" }}>
            {/* Sidebar mock */}
            <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "12px" }}>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: "12px" }}>Blocos</p>
              {["Hero", "Texto", "Imagem", "Feature Grid", "CTA", "FAQ"].map((b) => (
                <div key={b} style={{ padding: "8px 10px", borderRadius: "8px", marginBottom: "4px", backgroundColor: "#334155", color: "#94a3b8", fontSize: "0.8125rem" }}>{b}</div>
              ))}
            </div>
            {/* Canvas mock */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ backgroundColor: "#6366f1", padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "white" }}>Seu título aqui</div>
                  <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>Subtítulo de exemplo</div>
                </div>
                <div style={{ padding: "16px", flex: 1 }}>
                  <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", width: "80%", marginBottom: "8px" }} />
                  <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            </div>
            {/* Properties mock */}
            <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "12px" }}>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", marginBottom: "12px" }}>Propriedades</p>
              {["Título", "Subtítulo", "Botão", "Alinhamento", "Cor de fundo"].map((p) => (
                <div key={p} style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "3px" }}>{p}</div>
                  <div style={{ height: "28px", backgroundColor: "#334155", borderRadius: "6px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnicalSeoSection() {
  const checks = [
    "Title tag presente e com tamanho ideal",
    "Meta description definida",
    "Open Graph configurado",
    "Structured data (JSON-LD) válido",
    "Sitemap XML dinâmico",
    "robots.txt por site",
    "URL canônica definida",
    "Conteúdo suficiente na página",
    "Imagens com alt text",
  ];

  return (
    <section style={{ padding: "96px 24px", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-block", padding: "4px 14px", backgroundColor: "#dcfce7", color: "#16a34a", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "16px" }}>
            SEO nativo
          </span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, marginBottom: "16px" }}>
            Auditoria SEO automática para cada página
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "24px" }}>
            9 verificações de SEO rodando automaticamente a cada publicação. Score de 0-100 com drill-down por problema.
          </p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6366f1", textDecoration: "none", fontWeight: 600 }}>
            Experimentar agora <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {checks.map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", backgroundColor: "white", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <Check size={16} color="#22c55e" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "0.9375rem", color: "#334155" }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    { feature: "Editor visual de blocos", webway: true, wp: false, wix: true },
    { feature: "Blog com rich text nativo", webway: true, wp: true, wix: true },
    { feature: "Auditoria SEO automática", webway: true, wp: false, wix: false },
    { feature: "JSON-LD por página/post", webway: true, wp: false, wix: false },
    { feature: "Performance SSR/ISR", webway: true, wp: false, wix: false },
    { feature: "Self-hosting disponível", webway: true, wp: true, wix: false },
    { feature: "Sem plugins obrigatórios", webway: true, wp: false, wix: true },
    { feature: "Código aberto (MIT)", webway: true, wp: true, wix: false },
  ];

  return (
    <section id="comparison" style={{ padding: "96px 24px", backgroundColor: "white" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <SectionHeader
          label="Comparativo"
          title="Por que Web Way?"
          desc="Compare com as plataformas tradicionais e veja a diferença."
        />
        <div style={{ marginTop: "48px", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: "0.875rem", fontWeight: 600, color: "#64748b" }}>Funcionalidade</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "0.875rem", fontWeight: 700, color: "#6366f1" }}>Web Way</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "#64748b" }}>WordPress</th>
                <th style={{ padding: "14px 16px", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "#64748b" }}>Wix</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "13px 20px", fontSize: "0.9375rem", color: "#334155" }}>{row.feature}</td>
                  <td style={{ padding: "13px 16px", textAlign: "center" }}><CellIcon val={row.webway} highlight /></td>
                  <td style={{ padding: "13px 16px", textAlign: "center" }}><CellIcon val={row.wp} /></td>
                  <td style={{ padding: "13px 16px", textAlign: "center" }}><CellIcon val={row.wix} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CellIcon({ val, highlight }: { val: boolean; highlight?: boolean }) {
  return val
    ? <Check size={18} color={highlight ? "#6366f1" : "#22c55e"} style={{ margin: "0 auto" }} />
    : <span style={{ color: "#cbd5e1", fontSize: "1.25rem" }}>—</span>;
}

function CtaSection() {
  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", textAlign: "center" }}>
      <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "white", marginBottom: "16px" }}>
        Pronto para começar?
      </h2>
      <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.85)", marginBottom: "40px", maxWidth: "480px", margin: "0 auto 40px" }}>
        Crie sua conta grátis e publique seu primeiro site em menos de 10 minutos.
      </p>
      <Link
        href="/signup"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 36px", backgroundColor: "white", color: "#6366f1", borderRadius: "10px", fontWeight: 700, textDecoration: "none", fontSize: "1.0625rem" }}
      >
        Criar conta grátis <ArrowRight size={18} />
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f172a", color: "#94a3b8", padding: "48px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#6366f1" }}>Web Way</span>
        <p style={{ fontSize: "0.875rem" }}>© {new Date().getFullYear()} Web Way. Feito com Next.js e muito café.</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#64748b" }}><Github size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
      <span style={{ display: "inline-block", padding: "4px 14px", backgroundColor: "#ede9fe", color: "#7c3aed", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "16px" }}>
        {label}
      </span>
      <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, marginBottom: "12px" }}>{title}</h2>
      <p style={{ color: "#475569", fontSize: "1rem", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#475569",
  textDecoration: "none",
  fontSize: "0.9375rem",
  fontWeight: 500,
};
