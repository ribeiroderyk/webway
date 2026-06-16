# Blog — Especificação de Telas

---

## Tela: Lista de Posts

**Rota:** `/app/sites/[siteId]/posts`  
**Layout:** Admin padrão  
**Acesso:** Autenticado + dono do site

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Sites / Studio Web Way / Blog                                     │
│ Blog                                              [+ Novo Post]   │
│ Gerencie os posts do blog de Studio Web Way                       │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [🔍 Buscar posts...]                   [Status ▼]            │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Título           │ Status     │ Autor     │ Pub.  │ SEO │ ⋯  │ │
│ ├──────────────────┼────────────┼───────────┼───────┼─────┼───┤ │
│ │ Como criar sites │ ● Publicado│ João S.   │ 10/06 │ 85% │ ⋯ │ │
│ │ /como-criar-...  │            │           │       │     │   │ │
│ ├──────────────────┼────────────┼───────────┼───────┼─────┼───┤ │
│ │ Web Way vs WP    │ ○ Rascunho │ João S.   │  —    │ 40% │ ⋯ │ │
│ │ /web-way-vs-wp   │            │           │       │     │   │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│                           1-2 de 2 posts                         │
└───────────────────────────────────────────────────────────────────┘
```

### Menu de Ações (⋯) por Post

- Editar post
- Editar SEO
- Duplicar post
- Visualizar post público
- Publicar / Despublicar
- Excluir (confirmar)

---

## Tela: Criar / Editar Post

**Rota (criar):** `/app/sites/[siteId]/posts/new`  
**Rota (editar):** `/app/sites/[siteId]/posts/[postId]`  
**Layout:** Admin com layout full width (editor de texto precisa de espaço)

### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Sites / Studio / Blog / Novo Post                                │
│                                                                  │
│ ┌──────────────────────────────────┐ ┌──────────────────────┐   │
│ │                                  │ │                      │   │
│ │  [Imagem destaque]               │ │  PUBLICAÇÃO          │   │
│ │  ┌──────────────────────────┐    │ │  ──────────────────  │   │
│ │  │ + Adicionar imagem       │    │ │  Status:             │   │
│ │  │   de destaque            │    │ │  ○ Rascunho          │   │
│ │  └──────────────────────────┘    │ │  ● Publicado         │   │
│ │                                  │ │                      │   │
│ │  Título do post *                │ │  [Salvar]  [Pub.]    │   │
│ │  [Como criar sites rápidos    ]  │ │                      │   │
│ │                                  │ │  ──────────────────  │   │
│ │  Slug *                          │ │  SEO                 │   │
│ │  /blog/ [como-criar-sites    ]   │ │  Score: 85%          │   │
│ │                                  │ │  [Editar SEO]        │   │
│ │  Resumo (excerpt)                │ │                      │   │
│ │  [Aprenda como criar sites...]   │ │  ──────────────────  │   │
│ │                                  │ │  Autor               │   │
│ │  ──────────────────────────────  │ │  [João Silva]        │   │
│ │                                  │ │                      │   │
│ │  CONTEÚDO                        │ │  ──────────────────  │   │
│ │  ┌──────────────────────────┐    │ │  Data de Publicação  │   │
│ │  │ [Rich text editor]       │    │ │  [10/06/2026]        │   │
│ │  │                          │    │ │                      │   │
│ │  │ H1 H2 H3 B I U Link Img │    │ │                      │   │
│ │  │                          │    │ │                      │   │
│ │  │ Conteúdo do post aqui    │    │ │                      │   │
│ │  │                          │    │ │                      │   │
│ │  └──────────────────────────┘    │ │                      │   │
│ └──────────────────────────────────┘ └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Campos

| Campo          | Tipo        | Validação                              |
|----------------|-------------|----------------------------------------|
| title          | text        | Obrigatório, 2-200 chars               |
| slug           | text        | Obrigatório, único por site            |
| excerpt        | textarea    | Opcional, max 300 chars                |
| content        | rich text   | JSON (Tiptap/ProseMirror format)       |
| coverImageUrl  | media picker| Opcional, imagem do banco              |
| status         | radio       | draft / published                      |
| publishedAt    | date        | Auto quando publicado                  |
| authorId       | hidden      | Usuário logado                         |

### Editor de Conteúdo do Post

Editor de texto rico (não o editor de blocos do editor visual):

Toolbar:
```
H1 H2 H3 | B I U S | Link | Imagem | Lista | Blockquote | Code
```

Baseado em **Tiptap** (headless rich text editor sobre ProseMirror).
Persistido como JSON no campo `content`.

### Sidebar Direita do Post

**Card Publicação:**
- Status radio (Rascunho / Publicado)
- Botão Salvar (sempre disponível)
- Botão Publicar / Despublicar

**Card SEO (mini preview):**
- Score SEO (progress bar colorida)
- Botão "Editar SEO" → abre Drawer de SEO

**Card Autor:**
- Avatar + nome do autor (usuário logado no MVP)

**Card Data de Publicação:**
- Date picker (default: agora ao publicar)

---

## Drawer: Editar SEO do Post

Mesmo componente do SEO de página, aplicado ao post.

Campos adicionais para posts:
- **Data de publicação** (para `datePublished` no JSON-LD BlogPosting)
- **Autor** (para `author` no JSON-LD)

JSON-LD gerado para posts publicados:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Como criar sites rápidos",
  "author": { "@type": "Person", "name": "João Silva" },
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-12",
  "description": "Aprenda como criar...",
  "url": "https://webway.app/s/studio/blog/como-criar-sites"
}
```

---

## Tela Pública: Listagem do Blog

**Rota:** `/s/[siteSlug]/blog`  
**Renderização:** SSR  

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header do site]                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Blog                                                           │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ [cover image]   │  │ [cover image]   │  │ [cover image]   │ │
│  │ Como criar...   │  │ Web Way vs WP   │  │ SEO técnico...  │ │
│  │ 10/06 · 5 min   │  │ 08/06 · 3 min   │  │ 05/06 · 7 min   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│                   [1] [2] [3] Próxima →                         │
│                                                                 │
│  [Footer do site]                                               │
└─────────────────────────────────────────────────────────────────┘
```

Apenas posts com `status = "published"` são exibidos.

---

## Tela Pública: Post Individual

**Rota:** `/s/[siteSlug]/blog/[postSlug]`  
**Renderização:** SSR com ISR (revalidate 60s)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header do site]                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Blog > Como criar sites rápidos      ← breadcrumb             │
│                                                                 │
│  [IMAGEM DESTAQUE - full width]                                 │
│                                                                 │
│  Como criar sites rápidos com Web Way                           │  ← H1
│                                                                 │
│  João Silva · 10 de junho de 2026 · 5 min de leitura           │
│                                                                 │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  [Conteúdo do post renderizado]                                 │
│                                                                 │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  ← Post anterior       Próximo post →                           │
│                                                                 │
│  [Footer do site]                                               │
└─────────────────────────────────────────────────────────────────┘
```

Metadata gerada:
- title: `{post.seoTitle || post.title} | {site.name}`
- description: `{post.seoDescription || post.excerpt}`
- OG image: `post.ogImageUrl || post.coverImageUrl`
- canonical: URL do post
- JSON-LD: BlogPosting
