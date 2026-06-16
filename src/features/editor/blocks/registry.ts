import type { Block } from "@/types";

// ── Block Definition Interface ────────────────────────────────────

export interface BlockMeta {
  type: string;
  label: string;
  description: string;
  category: "structure" | "content" | "media" | "interaction";
  icon: string;
}

export interface BlockDefinition extends BlockMeta {
  defaults: Record<string, unknown>;
}

// ── Block Defaults ────────────────────────────────────────────────

const heroDefaults = {
  headline: "Título principal aqui",
  subheadline: "Subtítulo ou descrição da seção",
  eyebrow: "",
  buttonText: "Começar agora",
  buttonUrl: "#",
  imageUrl: "",
  alignment: "center",
  bgColor: "transparent",
};

const textDefaults = {
  title: "Título da seção",
  content: "Conteúdo do texto aqui. Descreva o que você quiser.",
  alignment: "left",
};

const imageDefaults = {
  imageUrl: "",
  altText: "",
  caption: "",
  aspectRatio: "16:9",
};

const featureGridDefaults = {
  title: "Por que nos escolher?",
  description: "Oferecemos soluções completas para o seu negócio.",
  features: [
    { title: "Feature 1", description: "Descrição da feature 1", icon: "star" },
    { title: "Feature 2", description: "Descrição da feature 2", icon: "zap" },
    { title: "Feature 3", description: "Descrição da feature 3", icon: "shield" },
  ],
};

const ctaDefaults = {
  title: "Pronto para começar?",
  description: "Entre em contato e vamos conversar sobre o seu projeto.",
  buttonText: "Falar conosco",
  buttonUrl: "#contato",
  bgColor: "#6366f1",
};

const contactDefaults = {
  title: "Entre em contato",
  description: "Respondemos em até 24 horas.",
  email: "",
  phone: "",
  address: "",
};

const faqDefaults = {
  title: "Perguntas frequentes",
  items: [
    { question: "Pergunta 1?", answer: "Resposta para a pergunta 1." },
    { question: "Pergunta 2?", answer: "Resposta para a pergunta 2." },
    { question: "Pergunta 3?", answer: "Resposta para a pergunta 3." },
  ],
};

const testimonialsDefaults = {
  title: "O que nossos clientes dizem",
  testimonials: [
    {
      name: "Maria Silva",
      role: "CEO, Empresa X",
      content: "Excelente trabalho! Superou todas as nossas expectativas.",
      avatarUrl: "",
    },
    {
      name: "João Santos",
      role: "Diretor, Empresa Y",
      content: "Entrega rápida e qualidade impecável. Recomendo muito!",
      avatarUrl: "",
    },
  ],
};

// ── Registry ──────────────────────────────────────────────────────

export const blockRegistry: Record<string, BlockDefinition> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Seção principal com headline, subtítulo e botão CTA",
    category: "structure",
    icon: "layout",
    defaults: heroDefaults,
  },
  text: {
    type: "text",
    label: "Texto",
    description: "Bloco de texto com título e parágrafo",
    category: "content",
    icon: "type",
    defaults: textDefaults,
  },
  image: {
    type: "image",
    label: "Imagem",
    description: "Imagem com legenda e texto alternativo",
    category: "media",
    icon: "image",
    defaults: imageDefaults,
  },
  "feature-grid": {
    type: "feature-grid",
    label: "Feature Grid",
    description: "Grade de features ou benefícios em 3 colunas",
    category: "content",
    icon: "grid",
    defaults: featureGridDefaults,
  },
  cta: {
    type: "cta",
    label: "CTA",
    description: "Seção de chamada para ação com fundo colorido",
    category: "content",
    icon: "megaphone",
    defaults: ctaDefaults,
  },
  contact: {
    type: "contact",
    label: "Contato",
    description: "Informações de contato (email, telefone, endereço)",
    category: "interaction",
    icon: "mail",
    defaults: contactDefaults,
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "Perguntas e respostas em formato accordion",
    category: "content",
    icon: "help-circle",
    defaults: faqDefaults,
  },
  testimonials: {
    type: "testimonials",
    label: "Depoimentos",
    description: "Grade de depoimentos de clientes",
    category: "content",
    icon: "quote",
    defaults: testimonialsDefaults,
  },
};

export const blockCategories = [
  { id: "structure", label: "Estrutura" },
  { id: "content", label: "Conteúdo" },
  { id: "media", label: "Mídia" },
  { id: "interaction", label: "Interação" },
] as const;

export function getBlocksByCategory(category: string): BlockDefinition[] {
  return Object.values(blockRegistry).filter((b) => b.category === category);
}

export function createBlock(type: string): Block {
  const definition = blockRegistry[type];
  if (!definition) throw new Error(`Tipo de bloco desconhecido: ${type}`);

  return {
    id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    props: { ...definition.defaults },
  };
}
