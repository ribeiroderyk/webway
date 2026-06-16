# Web Way — Visão Geral do Sistema

> Especificação completa de todas as telas e funcionalidades do MVP da Web Way.

---

## Áreas da Aplicação

### 1. Site Institucional (Público)
Rota: `/`
Landing page que apresenta e vende a plataforma Web Way.

### 2. Autenticação
Rotas: `/signup`, `/login`, `/forgot-password`
Cadastro, login e recuperação de senha.

### 3. Painel Administrativo
Rota base: `/app`
Área protegida onde usuários gerenciam seus sites.

### 4. Sites Públicos Gerados
Rota base: `/s/[siteSlug]`
Sites criados pelos usuários, renderizados publicamente.

---

## Mapa de Rotas Completo

```
/ ...................... Landing page da Web Way
/signup ................ Cadastro
/login ................. Login
/forgot-password ....... Recuperação de senha

/app/dashboard ......... Dashboard principal
/app/sites ............. Lista de sites
/app/sites/new ......... Criar novo site
/app/sites/[siteId] .... Visão geral do site (redirect para pages)
/app/sites/[siteId]/pages ............. Lista de páginas
/app/sites/[siteId]/pages/new ......... Nova página
/app/sites/[siteId]/pages/[pageId]/editor .. Editor visual
/app/sites/[siteId]/posts ............. Lista de posts
/app/sites/[siteId]/posts/new ......... Novo post
/app/sites/[siteId]/posts/[postId] .... Editar post
/app/sites/[siteId]/media ............. Biblioteca de mídia
/app/sites/[siteId]/seo ............... Configurações SEO do site
/app/sites/[siteId]/settings .......... Configurações do site
/app/templates ........ Galeria de templates
/app/account .......... Configurações da conta
/app/workspace ........ Configurações do workspace

/s/[siteSlug] ................. Home do site público
/s/[siteSlug]/[pageSlug] ...... Página do site
/s/[siteSlug]/blog ............ Listagem de posts
/s/[siteSlug]/blog/[postSlug] . Post individual
/s/[siteSlug]/sitemap.xml ..... Sitemap do site

/robots.txt ................... Robots.txt global
/api/health ................... Healthcheck
```

---

## Perfis de Usuário (MVP)

| Perfil   | Descrição                                                     |
|----------|---------------------------------------------------------------|
| Owner    | Criador do workspace. Acesso total. Único perfil no MVP.      |
| (futuro) | Admin, Editor, Viewer, Client — preparado no modelo mas não ativo |

---

## Estados de Conteúdo

| Entidade | Estados             |
|----------|---------------------|
| Site     | draft, published, archived |
| Page     | draft, published    |
| Post     | draft, published    |

---

## Fluxo Principal do Usuário

```
1. Cadastro / Login
       ↓
2. Dashboard (workspace criado automaticamente)
       ↓
3. Criar Site (nome, slug, idioma)
       ↓
4. Lista de Páginas (site criado com página Home padrão)
       ↓
5. Abrir Editor da página Home
       ↓
6. Adicionar e configurar blocos
       ↓
7. Salvar rascunho → Publicar
       ↓
8. Configurar SEO da página
       ↓
9. Publicar o Site
       ↓
10. Visualizar site público em /s/[slug]
```

---

## Consistência Visual

Todas as telas do admin devem seguir o Design System em:
- [tokens.md](../design-system/tokens.md) — cores, tipografia, espaçamento
- [layout.md](../design-system/layout.md) — estrutura de layout
- [components/](../design-system/components/) — componentes padronizados

---

## Índice de Specs

| Arquivo              | Área                          |
|----------------------|-------------------------------|
| 01-auth.md           | Autenticação                  |
| 02-landing.md        | Landing page da Web Way       |
| 03-dashboard.md      | Dashboard                     |
| 04-sites.md          | Gestão de sites               |
| 05-pages.md          | Gestão de páginas             |
| 06-editor.md         | Editor visual de blocos       |
| 07-blog.md           | Gestão de posts               |
| 08-media.md          | Biblioteca de mídia           |
| 09-seo.md            | Configurações SEO             |
| 10-settings.md       | Configurações do site         |
| 11-account.md        | Conta e workspace             |
| 12-templates.md      | Galeria de templates          |
| 13-public-sites.md   | Sites públicos gerados        |
| 14-data-model.md     | Modelo de dados               |
| 15-api.md            | Endpoints e server actions    |
