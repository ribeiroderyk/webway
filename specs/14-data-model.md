# Data Model — Especificação

> Modelagem completa do banco de dados em Prisma Schema. Todas as tabelas e colunas em inglês.

---

## Schema Prisma Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// AUTENTICAÇÃO E USUÁRIOS
// ─────────────────────────────────────────

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  avatarUrl    String?
  role         UserRole @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  workspaces WorkspaceMember[]
  posts      Post[]

  @@map("users")
}

enum UserRole {
  USER
  ADMIN  // admin da plataforma (futuro)
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  userAgent String?
  ipAddress String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@map("sessions")
}

// ─────────────────────────────────────────
// WORKSPACE
// ─────────────────────────────────────────

model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  ownerId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members WorkspaceMember[]
  sites   Site[]

  @@map("workspaces")
}

model WorkspaceMember {
  id          String          @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole   @default(EDITOR)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@map("workspace_members")
}

enum WorkspaceRole {
  OWNER
  ADMIN
  EDITOR
  VIEWER
  CLIENT
}

// ─────────────────────────────────────────
// SITES
// ─────────────────────────────────────────

model Site {
  id                     String     @id @default(cuid())
  workspaceId            String
  name                   String
  slug                   String
  description            String?
  logoUrl                String?
  faviconUrl             String?
  primaryColor           String     @default("#6366f1")
  language               String     @default("pt-BR")
  timezone               String     @default("America/Sao_Paulo")
  status                 SiteStatus @default(DRAFT)
  customDomain           String?
  googleSiteVerification String?
  createdAt              DateTime   @default(now())
  updatedAt              DateTime   @updatedAt

  workspace  Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  pages      Page[]
  posts      Post[]
  media      Media[]
  redirects  Redirect[]

  @@unique([workspaceId, slug])
  @@index([slug])
  @@map("sites")
}

enum SiteStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ─────────────────────────────────────────
// PÁGINAS
// ─────────────────────────────────────────

model Page {
  id             String      @id @default(cuid())
  siteId         String
  title          String
  slug           String
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?
  robotsIndex    Boolean     @default(true)
  robotsFollow   Boolean     @default(true)
  ogTitle        String?
  ogDescription  String?
  ogImageUrl     String?
  status         PageStatus  @default(DRAFT)
  blocks         Json        @default("[]")
  showInNav      Boolean     @default(true)
  navOrder       Int         @default(0)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  publishedAt    DateTime?

  site      Site        @relation(fields: [siteId], references: [id], onDelete: Cascade)
  seoAudits SeoAudit[]

  @@unique([siteId, slug])
  @@index([siteId, status])
  @@map("pages")
}

enum PageStatus {
  DRAFT
  PUBLISHED
}

// ─────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────

model Post {
  id             String     @id @default(cuid())
  siteId         String
  authorId       String
  title          String
  slug           String
  excerpt        String?
  content        Json       @default("{}")
  coverImageUrl  String?
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?
  robotsIndex    Boolean    @default(true)
  robotsFollow   Boolean    @default(true)
  ogTitle        String?
  ogDescription  String?
  ogImageUrl     String?
  status         PostStatus @default(DRAFT)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  publishedAt    DateTime?

  site      Site       @relation(fields: [siteId], references: [id], onDelete: Cascade)
  author    User       @relation(fields: [authorId], references: [id])
  seoAudits SeoAudit[]

  @@unique([siteId, slug])
  @@index([siteId, status])
  @@index([publishedAt])
  @@map("posts")
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// ─────────────────────────────────────────
// MÍDIA
// ─────────────────────────────────────────

model Media {
  id        String   @id @default(cuid())
  siteId    String
  fileName  String
  fileUrl   String
  mimeType  String
  size      Int      // bytes
  width     Int?
  height    Int?
  altText   String   @default("")
  caption   String   @default("")
  createdAt DateTime @default(now())

  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)

  @@index([siteId])
  @@map("media")
}

// ─────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────

model Template {
  id           String   @id @default(cuid())
  name         String
  description  String?
  category     String
  thumbnailUrl String?
  blocks       Json     @default("[]")
  isPublic     Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([category])
  @@map("templates")
}

// ─────────────────────────────────────────
// REDIRECTS
// ─────────────────────────────────────────

model Redirect {
  id         String   @id @default(cuid())
  siteId     String
  fromPath   String
  toPath     String
  statusCode Int      @default(301)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)

  @@unique([siteId, fromPath])
  @@map("redirects")
}

// ─────────────────────────────────────────
// SEO AUDIT
// ─────────────────────────────────────────

model SeoAudit {
  id        String   @id @default(cuid())
  pageId    String?
  postId    String?
  score     Int
  issues    Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  page Page? @relation(fields: [pageId], references: [id], onDelete: Cascade)
  post Post? @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@index([pageId])
  @@index([postId])
  @@map("seo_audits")
}
```

---

## Índices e Performance

Índices criados:
- `sessions.token` — lookup rápido de sessão por token
- `sites.slug` — lookup de site por slug na rota pública
- `sites.[workspaceId, slug]` — unicidade e filtro
- `pages.[siteId, status]` — filtrar páginas publicadas de um site
- `posts.[siteId, status]` — filtrar posts publicados
- `posts.publishedAt` — ordenar posts por data
- `media.siteId` — listar mídia de um site
- `templates.category` — filtrar por categoria

---

## Relacionamentos

```
User ──────────────── WorkspaceMember ──────── Workspace
                                                   │
                                                 Site[]
                                                   │
                              ┌──────────────────┬─┴──────────────────┐
                            Page[]            Post[]              Media[]
                              │                  │
                          SeoAudit[]         SeoAudit[]
```

---

## Seed de Dados

```ts
// prisma/seed.ts
// Cria:
// - 1 usuário demo (demo@webway.local / webway123)
// - 1 workspace (Studio Web Way)
// - 1 site publicado (studio-web-way)
// - 3 páginas (home, sobre, contato) — todas publicadas
// - 2 posts de blog — publicados
// - 5 templates públicos
// - 3 arquivos de mídia demo
```

---

## Convenções

- **IDs:** CUID (collision-resistant, ordenável por tempo)
- **Timestamps:** `DateTime` em UTC sempre
- **Soft delete:** não implementado no MVP (exclusão real)
- **Enums:** PascalCase no Prisma, mapeados para SCREAMING_SNAKE em SQL
- **Nomes de tabela:** `snake_case` via `@@map`
- **Nomes de coluna:** `camelCase` no Prisma, `snake_case` no SQL via Prisma default
