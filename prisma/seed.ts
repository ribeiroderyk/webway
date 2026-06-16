import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ── Usuário demo ────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("webway123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@webway.local" },
    update: {},
    create: {
      name: "Demo Web Way",
      email: "demo@webway.local",
      passwordHash,
      role: "USER",
    },
  });

  console.log(`✅ Usuário criado: ${user.email}`);

  // ── Workspace ───────────────────────────────────────────────────
  const workspace = await prisma.workspace.upsert({
    where: { slug: "studio-web-way" },
    update: {},
    create: {
      name: "Studio Web Way",
      slug: "studio-web-way",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  console.log(`✅ Workspace criado: ${workspace.name}`);

  // ── Site demo ───────────────────────────────────────────────────
  const site = await prisma.site.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: "studio-web-way",
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: "Studio Web Way",
      slug: "studio-web-way",
      description: "Site demo da plataforma Web Way",
      primaryColor: "#6366f1",
      language: "pt-BR",
      status: "PUBLISHED",
    },
  });

  console.log(`✅ Site criado: ${site.name}`);

  // ── Páginas ─────────────────────────────────────────────────────
  const now = new Date();

  const homePage = await prisma.page.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "/" } },
    update: {},
    create: {
      siteId: site.id,
      title: "Home",
      slug: "/",
      seoTitle: "Studio Web Way — Criação de Sites Profissionais",
      seoDescription:
        "O Studio Web Way é especializado em criar sites rápidos, bonitos e otimizados para o Google. Conheça nosso trabalho.",
      ogTitle: "Studio Web Way",
      ogDescription: "Criação de sites profissionais com SEO técnico.",
      robotsIndex: true,
      robotsFollow: true,
      status: "PUBLISHED",
      publishedAt: now,
      showInNav: false,
      navOrder: 0,
      blocks: [
        {
          id: "block_hero_home",
          type: "hero",
          props: {
            headline: "Criamos sites que aparecem no Google",
            subheadline:
              "Sites rápidos, bonitos e otimizados para buscadores. Do briefing ao ar em poucos dias.",
            eyebrow: "Agência Digital",
            buttonText: "Ver nosso trabalho",
            buttonUrl: "/sobre",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "block_features_home",
          type: "feature-grid",
          props: {
            title: "Por que escolher o Studio Web Way?",
            description: "Entregamos sites que geram resultados reais.",
            features: [
              {
                title: "SEO Técnico",
                description:
                  "Sites otimizados para aparecer no Google desde o primeiro dia.",
                icon: "search",
              },
              {
                title: "Performance",
                description:
                  "Carregamento ultra-rápido com tecnologia moderna.",
                icon: "zap",
              },
              {
                title: "Design Profissional",
                description:
                  "Identidade visual coerente com a sua marca.",
                icon: "palette",
              },
            ],
          },
        },
        {
          id: "block_cta_home",
          type: "cta",
          props: {
            title: "Pronto para ter um site que aparece no Google?",
            description:
              "Entre em contato e vamos conversar sobre o seu projeto.",
            buttonText: "Falar com a equipe",
            buttonUrl: "/contato",
            bgColor: "#6366f1",
          },
        },
      ],
    },
  });

  const aboutPage = await prisma.page.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "sobre" } },
    update: {},
    create: {
      siteId: site.id,
      title: "Sobre nós",
      slug: "sobre",
      seoTitle: "Sobre nós — Studio Web Way",
      seoDescription:
        "Conheça a equipe do Studio Web Way. Somos especialistas em criação de sites modernos, rápidos e otimizados para o Google.",
      robotsIndex: true,
      robotsFollow: true,
      status: "PUBLISHED",
      publishedAt: now,
      showInNav: true,
      navOrder: 1,
      blocks: [
        {
          id: "block_hero_about",
          type: "hero",
          props: {
            headline: "Somos o Studio Web Way",
            subheadline:
              "Uma equipe apaixonada por criar experiências digitais que funcionam de verdade.",
            eyebrow: "Nossa história",
            buttonText: "",
            buttonUrl: "",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "block_text_about",
          type: "text",
          props: {
            title: "Quem somos",
            content:
              "Fundado em 2020, o Studio Web Way nasceu com uma missão clara: criar sites que sejam ao mesmo tempo bonitos, rápidos e encontrados no Google. Trabalhamos com agências, freelancers e pequenos negócios que precisam de presença digital profissional.",
            alignment: "left",
          },
        },
        {
          id: "block_testimonials_about",
          type: "testimonials",
          props: {
            title: "O que nossos clientes dizem",
            testimonials: [
              {
                name: "Maria Silva",
                role: "CEO, Agência Criativa",
                content:
                  "Depois do novo site, nossas conversões aumentaram 40%. Recomendo muito!",
                avatarUrl: "",
              },
              {
                name: "João Santos",
                role: "Freelancer de Marketing",
                content:
                  "A equipe entregou antes do prazo e o resultado superou as expectativas.",
                avatarUrl: "",
              },
            ],
          },
        },
      ],
    },
  });

  const contactPage = await prisma.page.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "contato" } },
    update: {},
    create: {
      siteId: site.id,
      title: "Contato",
      slug: "contato",
      seoTitle: "Fale conosco — Studio Web Way",
      seoDescription:
        "Entre em contato com o Studio Web Way. Estamos prontos para ajudar com o seu próximo projeto digital.",
      robotsIndex: true,
      robotsFollow: true,
      status: "PUBLISHED",
      publishedAt: now,
      showInNav: true,
      navOrder: 2,
      blocks: [
        {
          id: "block_hero_contact",
          type: "hero",
          props: {
            headline: "Fale com a nossa equipe",
            subheadline: "Conte-nos sobre o seu projeto. Respondemos em até 24h.",
            eyebrow: "Contato",
            buttonText: "",
            buttonUrl: "",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "block_contact_info",
          type: "contact",
          props: {
            title: "Nossas informações",
            description: "Você pode nos contatar pelos canais abaixo.",
            email: "contato@studiowebway.com.br",
            phone: "+55 (11) 99999-9999",
            address: "São Paulo, SP — Brasil",
          },
        },
      ],
    },
  });

  console.log(`✅ Páginas criadas: ${homePage.title}, ${aboutPage.title}, ${contactPage.title}`);

  // ── Posts de blog ───────────────────────────────────────────────
  const post1 = await prisma.post.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "como-criar-sites-rapidos" } },
    update: {},
    create: {
      siteId: site.id,
      authorId: user.id,
      title: "Como criar sites rápidos que aparecem no Google",
      slug: "como-criar-sites-rapidos",
      excerpt:
        "Descubra as técnicas que usamos para criar sites com Core Web Vitals perfeitos e excelente posicionamento nos buscadores.",
      seoTitle: "Como criar sites rápidos e bem posicionados no Google",
      seoDescription:
        "Aprenda as principais técnicas de performance e SEO técnico para criar sites que carregam rápido e aparecem no Google.",
      robotsIndex: true,
      robotsFollow: true,
      status: "PUBLISHED",
      publishedAt: new Date("2026-06-10"),
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Performance e SEO andam juntos" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Um site rápido não é apenas uma questão de experiência do usuário — é também um fator de ranqueamento no Google. O algoritmo considera o LCP, INP e CLS como sinais importantes para decidir a posição do seu site nos resultados de busca.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "As principais técnicas" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Entre as técnicas mais eficazes estão: renderização no servidor (SSR/SSG), otimização de imagens com formatos modernos como WebP e AVIF, lazy loading para conteúdo abaixo do fold, e minimização do JavaScript enviado ao cliente.",
              },
            ],
          },
        ],
      },
    },
  });

  const post2 = await prisma.post.upsert({
    where: { siteId_slug: { siteId: site.id, slug: "seo-tecnico-guia-completo" } },
    update: {},
    create: {
      siteId: site.id,
      authorId: user.id,
      title: "SEO Técnico: guia completo para 2026",
      slug: "seo-tecnico-guia-completo",
      excerpt:
        "Tudo que você precisa saber sobre SEO técnico: sitemap, robots.txt, dados estruturados, canonical URLs e muito mais.",
      seoTitle: "SEO Técnico 2026 — Guia Completo",
      seoDescription:
        "Guia definitivo de SEO técnico: sitemap XML, robots.txt, JSON-LD, canonical URLs, Core Web Vitals e renderização server-side.",
      robotsIndex: true,
      robotsFollow: true,
      status: "PUBLISHED",
      publishedAt: new Date("2026-06-05"),
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "O que é SEO técnico?" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "SEO técnico é a base que garante que os mecanismos de busca consigam rastrear, entender e indexar o seu site corretamente. Sem uma base técnica sólida, até o melhor conteúdo pode não ser encontrado.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Pilares do SEO técnico" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Os pilares principais incluem: renderização amigável ao Googlebot, metadata completa (title, description, OG), dados estruturados JSON-LD, sitemap XML atualizado, robots.txt configurado corretamente e URLs canônicas bem definidas.",
              },
            ],
          },
        ],
      },
    },
  });

  console.log(`✅ Posts criados: ${post1.title}, ${post2.title}`);

  // ── Templates públicos ──────────────────────────────────────────
  const templates = [
    {
      name: "Landing Page — Agência",
      description: "Página de vendas completa para agências e freelancers",
      category: "landing-page",
      isPublic: true,
      blocks: [
        {
          id: "tpl_hero",
          type: "hero",
          props: {
            headline: "Transformamos ideias em sites que vendem",
            subheadline: "Design profissional, performance excepcional e SEO técnico do jeito certo.",
            eyebrow: "Agência Digital",
            buttonText: "Solicitar orçamento",
            buttonUrl: "/contato",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "tpl_features",
          type: "feature-grid",
          props: {
            title: "Por que nos escolher?",
            description: "Entregamos resultados mensuráveis.",
            features: [
              { title: "Design Profissional", description: "Sites que representam a sua marca.", icon: "palette" },
              { title: "SEO Incluído", description: "Ranqueamento desde o primeiro dia.", icon: "search" },
              { title: "Entrega Rápida", description: "Do briefing ao ar em dias.", icon: "zap" },
            ],
          },
        },
        {
          id: "tpl_testimonials",
          type: "testimonials",
          props: {
            title: "Clientes satisfeitos",
            testimonials: [
              { name: "Cliente 1", role: "CEO", content: "Resultado excelente e entrega no prazo!", avatarUrl: "" },
              { name: "Cliente 2", role: "Gerente", content: "Nossa presença online melhorou muito.", avatarUrl: "" },
            ],
          },
        },
        {
          id: "tpl_cta",
          type: "cta",
          props: {
            title: "Pronto para começar?",
            description: "Entre em contato e receba um orçamento sem compromisso.",
            buttonText: "Falar conosco",
            buttonUrl: "/contato",
            bgColor: "#6366f1",
          },
        },
        {
          id: "tpl_contact",
          type: "contact",
          props: {
            title: "Entre em contato",
            description: "Respondemos em até 24 horas.",
            email: "contato@suaempresa.com",
            phone: "",
            address: "",
          },
        },
      ],
    },
    {
      name: "Blog Pessoal",
      description: "Layout limpo para criadores de conteúdo",
      category: "blog",
      isPublic: true,
      blocks: [
        {
          id: "tpl_blog_hero",
          type: "hero",
          props: {
            headline: "Olá, eu sou {seu nome}",
            subheadline: "Escrevo sobre tecnologia, design e negócios digitais.",
            eyebrow: "Blog",
            buttonText: "Ler meus artigos",
            buttonUrl: "/blog",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "tpl_blog_text",
          type: "text",
          props: {
            title: "Sobre este blog",
            content: "Aqui compartilho meu conhecimento e experiências sobre temas que me apaixonam. Espero que os conteúdos sejam úteis para você também.",
            alignment: "center",
          },
        },
        {
          id: "tpl_blog_cta",
          type: "cta",
          props: {
            title: "Não perca nenhum artigo",
            description: "Assine a newsletter e receba novidades em primeira mão.",
            buttonText: "Assinar newsletter",
            buttonUrl: "#newsletter",
            bgColor: "#0891b2",
          },
        },
      ],
    },
    {
      name: "Portfólio Criativo",
      description: "Mostre seu trabalho com impacto",
      category: "portfolio",
      isPublic: true,
      blocks: [
        {
          id: "tpl_port_hero",
          type: "hero",
          props: {
            headline: "{Seu nome} — Designer & Desenvolvedor",
            subheadline: "Crio experiências digitais que encantam e convertem.",
            eyebrow: "Portfólio",
            buttonText: "Ver projetos",
            buttonUrl: "#projetos",
            imageUrl: "",
            alignment: "left",
            bgColor: "transparent",
          },
        },
        {
          id: "tpl_port_features",
          type: "feature-grid",
          props: {
            title: "Projetos em destaque",
            description: "Uma seleção do meu trabalho mais recente.",
            features: [
              { title: "Projeto 1", description: "Descrição do projeto", icon: "layout" },
              { title: "Projeto 2", description: "Descrição do projeto", icon: "monitor" },
              { title: "Projeto 3", description: "Descrição do projeto", icon: "smartphone" },
            ],
          },
        },
        {
          id: "tpl_port_testimonials",
          type: "testimonials",
          props: {
            title: "Depoimentos",
            testimonials: [
              { name: "Cliente", role: "Empresa", content: "Trabalho incrível!", avatarUrl: "" },
            ],
          },
        },
        {
          id: "tpl_port_contact",
          type: "contact",
          props: {
            title: "Vamos trabalhar juntos?",
            description: "Entre em contato e vamos conversar.",
            email: "seu@email.com",
            phone: "",
            address: "",
          },
        },
      ],
    },
    {
      name: "Página Sobre",
      description: "Página sobre a empresa ou pessoa",
      category: "page",
      isPublic: true,
      blocks: [
        {
          id: "tpl_about_hero",
          type: "hero",
          props: {
            headline: "Nossa história",
            subheadline: "Conheça quem está por trás de tudo isso.",
            eyebrow: "Sobre nós",
            buttonText: "",
            buttonUrl: "",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "tpl_about_text",
          type: "text",
          props: {
            title: "Quem somos",
            content: "Conte a história da sua empresa aqui. O que você faz, por que você faz e para quem você faz.",
            alignment: "left",
          },
        },
        {
          id: "tpl_about_values",
          type: "feature-grid",
          props: {
            title: "Nossos valores",
            description: "",
            features: [
              { title: "Qualidade", description: "Entregamos o melhor sempre.", icon: "star" },
              { title: "Transparência", description: "Comunicação clara e honesta.", icon: "eye" },
              { title: "Inovação", description: "Sempre buscando o que há de melhor.", icon: "lightbulb" },
            ],
          },
        },
      ],
    },
    {
      name: "Página Contato",
      description: "Formulário e informações de contato",
      category: "page",
      isPublic: true,
      blocks: [
        {
          id: "tpl_contact_hero",
          type: "hero",
          props: {
            headline: "Fale conosco",
            subheadline: "Estamos prontos para ajudar. Respondemos em até 24 horas.",
            eyebrow: "Contato",
            buttonText: "",
            buttonUrl: "",
            imageUrl: "",
            alignment: "center",
            bgColor: "transparent",
          },
        },
        {
          id: "tpl_contact_info",
          type: "contact",
          props: {
            title: "Nossas informações",
            description: "Escolha o canal mais conveniente para você.",
            email: "contato@suaempresa.com",
            phone: "+55 (11) 99999-9999",
            address: "Sua cidade, Estado — Brasil",
          },
        },
      ],
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: `tpl_${template.category}_${template.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}` },
      update: {},
      create: {
        id: `tpl_${template.category}_${template.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
        ...template,
        blocks: template.blocks as any,
      },
    });
  }

  console.log(`✅ ${templates.length} templates criados`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("─────────────────────────────────────────");
  console.log("Acesse: http://localhost:3000");
  console.log("Login: demo@webway.local");
  console.log("Senha: webway123");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((error) => {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
