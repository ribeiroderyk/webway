# Web Way

> CMS moderno para criar, editar e publicar sites profissionais.

**Crie sites rápidos, bonitos e fáceis de gerenciar.**

Web Way é uma plataforma open source para agências, freelancers e pequenos negócios que precisam de sites profissionais, rápidos, seguros e otimizados para o Google — sem depender de plugins inseguros ou hospedagem específica.

---

## Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript (strict)
- **UI:** React 19 + Tailwind CSS + shadcn/ui
- **Banco:** PostgreSQL 15+ via Prisma 5
- **Autenticação:** Sessões próprias (bcrypt)
- **Validação:** Zod
- **Editor:** Tiptap (posts) + Editor de blocos próprio (páginas)
- **Deploy:** Node.js / Docker / VPS / PaaS

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- npm ou pnpm

---

## Instalação Local

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/web-way.git
cd web-way

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Instalar dependências
npm install

# 4. Migrations e seed
npx prisma migrate dev --name init
npx prisma db seed

# 5. Iniciar
npm run dev
```

Acesse: http://localhost:3000

---

## Instalação com Docker

```bash
cp .env.example .env
# Edite SESSION_SECRET e NEXT_PUBLIC_APP_URL no .env

docker compose up -d
```

Aguarde a inicialização e acesse: http://localhost:3000

---

## Usuário Demo

```
E-mail: demo@webway.local
Senha:  webway123
```

---

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run db:migrate   # Migrations (dev)
npm run db:deploy    # Migrations (prod)
npm run db:seed      # Seed de dados demo
npm run db:studio    # Prisma Studio (visualizador do banco)
```

---

## Healthcheck

```bash
GET /api/health
```

Retorna status do app, banco e versão.

---

## Estrutura Principal

```
/
├── prisma/            ← Schema e seed do banco
├── public/            ← Assets públicos e uploads
├── src/
│   ├── app/           ← Next.js App Router (rotas)
│   │   ├── (public)/  ← Landing page
│   │   ├── (auth)/    ← Login, signup
│   │   ├── app/       ← Painel admin
│   │   ├── s/         ← Sites públicos gerados
│   │   └── api/       ← API routes
│   ├── components/    ← Componentes React
│   ├── features/      ← Lógica por domínio
│   │   └── editor/
│   │       └── blocks/← Blocos do editor
│   ├── server/        ← Services e lógica de servidor
│   └── lib/           ← Utilitários compartilhados
├── specs/             ← Especificações de telas
├── docs/              ← Documentação técnica
└── design-system/     ← Design system
```

---

## Rotas Disponíveis

```
/                           Landing page
/login                      Login
/signup                     Cadastro
/app/dashboard              Dashboard
/app/sites                  Lista de sites
/app/sites/new              Criar site
/app/sites/[id]/pages       Páginas do site
/app/sites/[id]/pages/[id]/editor  Editor visual
/app/sites/[id]/posts       Blog
/app/sites/[id]/media       Biblioteca de mídia
/app/sites/[id]/seo         Configurações SEO
/app/sites/[id]/settings    Configurações do site
/app/templates              Templates
/app/account                Conta
/s/[siteSlug]               Site público
/s/[siteSlug]/blog          Blog público
/s/[siteSlug]/sitemap.xml   Sitemap
/robots.txt                 Robots.txt
/api/health                 Healthcheck
```

---

## Criar Blocos Personalizados

Veja a documentação completa em [docs/blocks.md](docs/blocks.md).

Resumo rápido:

```
src/features/editor/blocks/meu-bloco/
  MeuBloco.tsx         ← Renderização pública
  MeuBlocoEditor.tsx   ← Formulário no editor
  schema.ts            ← Tipos + validação Zod
  defaults.ts          ← Valores padrão
  index.ts             ← Exporta a BlockDefinition
```

Registre em `src/features/editor/blocks/registry.ts`.

---

## Configurar SEO

Veja [docs/seo.md](docs/seo.md) para o guia completo.

Cada página e post tem campos SEO individuais:
- Título SEO (max 60 chars)
- Descrição (max 160 chars)
- Open Graph (título, descrição, imagem)
- Canonical URL
- Robots (index/noindex, follow/nofollow)

Sitemap gerado automaticamente em `/s/[siteSlug]/sitemap.xml`.

---

## Deploy em VPS

```bash
# Build
npm run build

# Migrations
npx prisma migrate deploy

# PM2
pm2 start npm --name "webway" -- start
pm2 save && pm2 startup
```

Veja [docs/deployment.md](docs/deployment.md) para guia completo com Nginx e SSL.

---

## Deploy em PaaS

Compatível com Railway, Render, Fly.io e DigitalOcean App Platform.

Veja [docs/installation.md](docs/installation.md) para instruções por plataforma.

---

## Troubleshooting

**Erro de conexão com banco:**
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Verificar DATABASE_URL no .env
echo $DATABASE_URL
```

**Migrations com erro:**
```bash
# Resetar banco (apaga tudo!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status
```

**Build com erro de TypeScript:**
```bash
npm run typecheck
```

**Healthcheck falhando:**
```bash
curl -v http://localhost:3000/api/health
```

---

## Documentação

- [Arquitetura](docs/architecture.md)
- [Instalação e Deploy](docs/installation.md)
- [Deploy Avançado](docs/deployment.md)
- [Sistema de Blocos](docs/blocks.md)
- [SEO Técnico](docs/seo.md)
- [Especificações de Telas](specs/)
- [Design System](design-system/)
- [Roadmap](ROADMAP.md)

---

## Licença

MIT © 2026 Web Way
