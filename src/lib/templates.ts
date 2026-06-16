import type { Block } from "@/types";

export interface PageTemplate {
  key: string;
  label: string;
  description: string;
  emoji: string;
  blocks: Block[];
}

function id() {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: "blank",
    label: "Página em branco",
    description: "Comece do zero com o editor de blocos.",
    emoji: "📄",
    blocks: [],
  },
  {
    key: "landing",
    label: "Landing Page",
    description: "Hero + Grade de features + CTA. Ideal para produto ou serviço.",
    emoji: "🚀",
    blocks: [
      {
        id: id(),
        type: "hero",
        props: {
          headline: "Seu título principal aqui",
          subheadline: "Uma breve descrição do seu produto ou serviço que convença o visitante.",
          eyebrow: "Novidade",
          buttonText: "Começar agora",
          buttonUrl: "#contato",
          imageUrl: "",
          alignment: "center",
          bgColor: "#f8fafc",
        },
      },
      {
        id: id(),
        type: "feature-grid",
        props: {
          title: "Por que nos escolher?",
          description: "Oferecemos soluções completas para o seu negócio crescer.",
          features: [
            { title: "Rápido", description: "Entregamos resultados em tempo recorde.", icon: "zap" },
            { title: "Confiável", description: "Mais de 500 clientes satisfeitos.", icon: "shield" },
            { title: "Suporte", description: "Atendimento dedicado 7 dias por semana.", icon: "headphones" },
          ],
        },
      },
      {
        id: id(),
        type: "cta",
        props: {
          title: "Pronto para começar?",
          description: "Entre em contato agora e receba uma proposta personalizada.",
          buttonText: "Falar conosco",
          buttonUrl: "#contato",
          bgColor: "#6366f1",
        },
      },
      {
        id: id(),
        type: "contact",
        props: {
          title: "Entre em contato",
          description: "Respondemos em até 24 horas úteis.",
          email: "contato@seusite.com.br",
          phone: "",
          address: "",
        },
      },
    ],
  },
  {
    key: "about",
    label: "Sobre nós",
    description: "Hero + Texto institucional + Depoimentos.",
    emoji: "👋",
    blocks: [
      {
        id: id(),
        type: "hero",
        props: {
          headline: "Conheça nossa história",
          subheadline: "Somos uma empresa comprometida em entregar o melhor para nossos clientes.",
          eyebrow: "",
          buttonText: "",
          buttonUrl: "",
          imageUrl: "",
          alignment: "center",
          bgColor: "#f8fafc",
        },
      },
      {
        id: id(),
        type: "text",
        props: {
          title: "Nossa missão",
          content: "Aqui vai a descrição da missão da sua empresa. Fale sobre os valores, a visão e o que diferencia o seu negócio no mercado.",
          alignment: "left",
        },
      },
      {
        id: id(),
        type: "text",
        props: {
          title: "Nossa história",
          content: "Conte a trajetória da empresa desde o início. Quanto tempo no mercado, principais conquistas e onde pretendem chegar.",
          alignment: "left",
        },
      },
      {
        id: id(),
        type: "testimonials",
        props: {
          title: "O que nossos clientes dizem",
          testimonials: [
            { name: "Maria Silva", role: "CEO, Empresa X", content: "Excelente trabalho! Superou todas as nossas expectativas.", avatarUrl: "" },
            { name: "João Santos", role: "Diretor, Empresa Y", content: "Entrega rápida e qualidade impecável. Recomendo muito!", avatarUrl: "" },
          ],
        },
      },
    ],
  },
  {
    key: "contact",
    label: "Contato",
    description: "Página simples com hero e informações de contato.",
    emoji: "📬",
    blocks: [
      {
        id: id(),
        type: "hero",
        props: {
          headline: "Fale com a gente",
          subheadline: "Estamos aqui para ajudar. Entre em contato pelo canal que preferir.",
          eyebrow: "",
          buttonText: "",
          buttonUrl: "",
          imageUrl: "",
          alignment: "center",
          bgColor: "#f8fafc",
        },
      },
      {
        id: id(),
        type: "contact",
        props: {
          title: "Informações de contato",
          description: "Respondemos em até 24 horas úteis.",
          email: "contato@seusite.com.br",
          phone: "(11) 9 9999-9999",
          address: "Rua Exemplo, 123 — São Paulo, SP",
        },
      },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Hero + seção de perguntas frequentes.",
    emoji: "❓",
    blocks: [
      {
        id: id(),
        type: "hero",
        props: {
          headline: "Perguntas frequentes",
          subheadline: "Reunimos as dúvidas mais comuns. Não encontrou o que procura? Fale conosco.",
          eyebrow: "",
          buttonText: "",
          buttonUrl: "",
          imageUrl: "",
          alignment: "center",
          bgColor: "#f8fafc",
        },
      },
      {
        id: id(),
        type: "faq",
        props: {
          title: "Dúvidas frequentes",
          items: [
            { question: "Como funciona o serviço?", answer: "Descreva aqui como funciona o seu serviço de forma clara e objetiva." },
            { question: "Qual é o prazo de entrega?", answer: "Informe os prazos praticados pela sua empresa." },
            { question: "Como faço para cancelar?", answer: "Explique a política de cancelamento aqui." },
            { question: "Vocês oferecem suporte?", answer: "Descreva os canais e horários de atendimento." },
          ],
        },
      },
    ],
  },
];

export function getTemplate(key: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.key === key);
}
