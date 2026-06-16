# Arquitetura — Web Way

---

## Visão Geral

A Web Way é uma aplicação Next.js full-stack com App Router, usando PostgreSQL via Prisma, autenticação própria baseada em sessões, e renderização server-side para páginas públicas.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                 │
│   Browser (React, Tailwind, Lucide)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / Server Actions
┌────────────────────────────▼────────────────────────────────────┐
│                    NEXT.JS APP (NODE.JS)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ App Router   │  │  API Routes  │  │   Server Actions     │  │
│  │ (RSC + SSR)  │  │  /api/**     │  │   (form mutations)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│  ┌──────▼─────────────────▼──────────────────────▼───────────┐  │
│  │                    SERVICES LAYER                          │  │
│  │  workspaceService  siteService  pageService  seoService   │  │
│  │  postService  mediaService  permissionService             │  │
│  └──────────────────────────────┬────────────────────────────┘  │
│                                 │                               │
│  ┌──────────────────────────────▼────────────────────────────┐  │
│  │                    PRISMA ORM                              │  │
│  └──────────────────────────────┬────────────────────────────┘  │
└─────────────────────────────────┼───────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────┐
│                       POSTGRESQL                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Técnica

| Camada             | Tecnologia                          |
|--------------------|-------------------------------------|
| Framework          | Next.js 15 (App Router)             |
| Linguagem          | TypeScript (strict mode)            |
| UI                 | React 19                            |
| Estilização        | Tailwind CSS v4                     |
| Componentes        | shadcn/ui (Radix UI base)           |
| Ícones             | Lucide React                        |
| Banco              | PostgreSQL 15+                      |
| ORM                | Prisma 5                            |
| Autenticação       | Própria (sessões + bcrypt)          |
| Validação          | Zod                                 |
| Editor rich text   | Tiptap                              |
| Upload             | Local (MVP) / Adaptável para S3     |
| SEO                | next/seo + generateMetadata         |
| Deploy             | Node.js / Docker                    |

---

## Estrutura de Pastas

```
/
├── prisma/
│   ├── schema.prisma          ← Definição do banco
│   └── seed.ts                ← Dados iniciais
│
├── public/
│   ├── uploads/               ← Uploads locais (MVP)
│   └── favicon.ico
│
├── src/
│   ├── app/                   ← Next.js App Router
│   │   ├── (public)/          ← Landing page
│   │   │   └── page.tsx       ← /
│   │   ├── (auth)/            ← Autenticação
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── app/               ← Painel admin (protegido)
│   │   │   ├── dashboard/
│   │   │   ├── sites/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [siteId]/
│   │   │   │       ├── pages/
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   └── [pageId]/editor/
│   │   │   │       ├── posts/
│   │   │   │       ├── media/
│   │   │   │       ├── seo/
│   │   │   │       └── settings/
│   │   │   ├── templates/
│   │   │   ├── account/
│   │   │   └── workspace/
│   │   ├── s/                 ← Sites públicos
│   │   │   └── [siteSlug]/
│   │   │       ├── page.tsx
│   │   │       ├── [pageSlug]/
│   │   │       ├── blog/
│   │   │       └── sitemap.xml/
│   │   ├── api/               ← API Routes
│   │   │   ├── auth/
│   │   │   ├── sites/
│   │   │   └── health/
│   │   ├── robots.txt/
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                ← Componentes base (shadcn)
│   │   ├── layout/            ← Sidebar, Topbar, PageHeader
│   │   ├── dashboard/         ← StatCard, ChecklistCard
│   │   ├── editor/            ← Editor, BlockLibrary, Canvas
│   │   └── seo/               ← SEOPreview, SEOForm, SEOAudit
│   │
│   ├── features/
│   │   ├── auth/              ← Lógica de autenticação
│   │   ├── workspaces/        ← Lógica de workspace
│   │   ├── sites/             ← Lógica de sites
│   │   ├── pages/             ← Lógica de páginas
│   │   ├── posts/             ← Lógica de posts
│   │   ├── media/             ← Lógica de mídia
│   │   ├── editor/
│   │   │   └── blocks/        ← Definição dos blocos
│   │   │       ├── hero/
│   │   │       ├── text/
│   │   │       ├── image/
│   │   │       ├── feature-grid/
│   │   │       ├── cta/
│   │   │       ├── contact/
│   │   │       ├── faq/
│   │   │       ├── testimonials/
│   │   │       └── registry.ts
│   │   ├── templates/
│   │   └── seo/
│   │
│   ├── server/
│   │   ├── services/
│   │   │   ├── workspaceService.ts
│   │   │   ├── siteService.ts
│   │   │   ├── pageService.ts
│   │   │   ├── postService.ts
│   │   │   ├── mediaService.ts
│   │   │   └── seoService.ts
│   │   └── repositories/      ← Queries Prisma organizadas
│   │
│   ├── lib/
│   │   ├── prisma.ts          ← Singleton Prisma Client
│   │   ├── auth.ts            ← Session management
│   │   ├── env.ts             ← Validação das envs com Zod
│   │   ├── validators.ts      ← Schemas Zod
│   │   ├── permissions.ts     ← Verificações de acesso
│   │   ├── seo.ts             ← Utilitários SEO
│   │   ├── storage.ts         ← Storage adapter
│   │   └── slug.ts            ← Slugify
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── types/
│       ├── blocks.ts          ← Tipos TypeScript dos blocos
│       └── index.ts
│
├── docs/                      ← Documentação
├── specs/                     ← Especificações de telas
├── design-system/             ← Design system
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Arquitetura de Blocos

### Registry

```ts
// /src/features/editor/blocks/registry.ts
export const blockRegistry: Record<string, BlockDefinition> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Seção principal com headline e CTA",
    category: "structure",
    icon: "layout",
    component: HeroBlock,      // renderização pública
    editorComponent: HeroBlockEditor,  // formulário no properties panel
    schema: heroSchema,        // validação Zod
    defaults: heroDefaults,    // valores padrão
  },
  // ... outros blocos
};
```

### BlockRenderer

```tsx
// /src/components/editor/BlockRenderer.tsx
export function BlockRenderer({ blocks, mode = "public" }: Props) {
  return (
    <>
      {blocks.map((block) => {
        const definition = blockRegistry[block.type];
        if (!definition) return null;
        
        const Component = mode === "canvas"
          ? definition.editorComponent
          : definition.component;
        
        return (
          <Component
            key={block.id}
            {...block.props}
          />
        );
      })}
    </>
  );
}
```

---

## Fluxo de Autenticação

```
1. POST /api/auth/login
   → validar credenciais
   → criar Session no banco
   → setar cookie httpOnly "session_token"

2. Middleware (middleware.ts)
   → verificar cookie em rotas /app/**
   → GET /api/auth/session (ou leitura direta da sessão)
   → sem sessão: redirect /login

3. Server Components
   → getSession(request) → user + workspace
   → passar para componentes via props ou context

4. POST /api/auth/logout
   → deletar Session do banco
   → limpar cookie
   → redirect /login
```

---

## Estratégia de Cache e Revalidação

| Tipo de conteúdo     | Estratégia                   | Revalidação      |
|----------------------|------------------------------|------------------|
| Landing page `/`     | SSG                          | Build            |
| Painel `/app/**`     | Dynamic (sem cache)          | —                |
| Site home `/s/[slug]`| SSR                          | Por request      |
| Página pública       | SSR                          | Por request      |
| Post de blog         | ISR                          | 60 segundos      |
| Sitemap              | ISR                          | 300 segundos     |
| robots.txt           | SSG revalidado               | Build/Deploy     |

---

## Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/webway

# Auth
SESSION_SECRET=secret-muito-longo-aqui
SESSION_EXPIRY_DAYS=30

# Storage (MVP: local)
STORAGE_PROVIDER=local
UPLOAD_DIR=./public/uploads

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Storage Cloud (opcional, futuro)
# S3_BUCKET=
# S3_REGION=
# S3_ACCESS_KEY=
# S3_SECRET_KEY=
# S3_ENDPOINT=  # para R2/MinIO
```

---

## Segurança

- **Senhas:** bcrypt com cost 12
- **Sessões:** token UUID aleatório, httpOnly cookie, SameSite=Strict
- **CSRF:** via SameSite cookie + verificação de origin em mutations
- **Autorização:** verificação de workspace em cada route handler
- **Upload:** validação de MIME type real (não apenas extensão), limite de tamanho
- **HTML sanitization:** DOMPurify ao renderizar rich text
- **SQL Injection:** impossível via Prisma (queries parametrizadas)
- **XSS:** React escapa HTML por padrão; rich text sanitizado
- **Rate Limiting:** middleware em rotas de auth (5 req/15min)
