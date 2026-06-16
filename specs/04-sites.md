# Sites — Especificação de Telas

---

## Tela: Lista de Sites

**Rota:** `/app/sites`  
**Layout:** Admin padrão  
**Acesso:** Autenticado

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Dashboard / Sites                                                 │ ← Breadcrumb
│ Sites                                    [+ Criar novo site]      │ ← PageHeader
│ Gerencie todos os sites do workspace                              │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [🔍 Buscar sites...]         [Status ▼] [≡ Lista] [⊞ Grid]  │ │ ← Toolbar
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│ │ Studio Web Way  │  │ Portfólio João  │  │ Blog Pessoal    │   │
│ │ /s/studio       │  │ /s/portfolio    │  │ /s/blog         │   │
│ │ ─────────────   │  │ ─────────────   │  │ ─────────────   │   │
│ │ 5 pág · 3 posts │  │ 8 pág · 0 posts │  │ 2 pág · 12 pst │   │
│ │ há 2 horas      │  │ há 1 dia        │  │ há 3 dias       │   │
│ │ ─────────────   │  │ ─────────────   │  │ ─────────────   │   │
│ │ ● Publicado     │  │ ● Publicado     │  │ ○ Rascunho      │   │
│ │ [Gerenciar] [⋯] │  │ [Gerenciar] [⋯] │  │ [Gerenciar] [⋯] │   │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘   │
│                                                                   │
│                          1-3 de 3 sites                          │
└───────────────────────────────────────────────────────────────────┘
```

### SiteCard — Detalhes

```
┌───────────────────────────────────────┐
│ [favicon/logo 32px]  Nome do Site [⋯] │  ← header, menu contextual
│ /s/slug-do-site                       │  ← URL (text-xs, clicável)
├───────────────────────────────────────┤
│ 5 páginas  ·  3 posts  ·  8 arquivos  │  ← stats
│ Atualizado há 2 horas                 │  ← RelativeTime
├───────────────────────────────────────┤
│ ● Publicado      [Gerenciar]  [Visitar]│  ← status + ações
└───────────────────────────────────────┘
```

**Menu contextual (⋯):**
- Editar configurações
- Duplicar site (futuramente)
- Visualizar site público
- Arquivar site
- Excluir site (confirmar)

**Status visual:**
- Publicado: badge success com ponto verde
- Rascunho: badge neutral com ponto cinza
- Arquivado: badge error com ícone

### Filtro de Status

Dropdown com opções: Todos, Publicado, Rascunho, Arquivado.

### Estado Vazio

```
[Globe icon 48px]
Nenhum site encontrado
Crie seu primeiro site para começar a publicar conteúdo profissional.
[+ Criar primeiro site]
```

### Dados Carregados

```ts
const sites = await getSitesByWorkspace(workspaceId, {
  search,
  status,
  page,
  perPage: 12,
  include: { _count: { pages: true, posts: true, media: true } }
});
```

---

## Tela: Criar Novo Site

**Rota:** `/app/sites/new`  
**Layout:** Admin com layout container (centralizado)  
**Acesso:** Autenticado

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Dashboard / Sites / Novo Site                                     │
│ Criar novo site                                                   │
│                                                                   │
│         ┌───────────────────────────────────────────────┐        │
│         │                                               │        │
│         │  Informações Básicas                          │        │
│         │  ─────────────────────────────────────        │        │
│         │                                               │        │
│         │  Nome do site *                               │        │
│         │  [Studio Web Way                           ]  │        │
│         │  Como seu site aparecerá para visitantes      │        │
│         │                                               │        │
│         │  Slug (URL) *                                 │        │
│         │  webway.app/s/ [studio-web-way            ]   │        │
│         │  Gerado automaticamente do nome               │        │
│         │                                               │        │
│         │  Descrição                                    │        │
│         │  [                                         ]  │        │
│         │  [                                         ]  │        │
│         │                                               │        │
│         │  Idioma do site *                             │        │
│         │  [Português (BR)                          ▼]  │        │
│         │                                               │        │
│         │  ─────────────────────────────────────        │        │
│         │  Aparência                                    │        │
│         │                                               │        │
│         │  Cor primária do site                         │        │
│         │  [●] #6366f1  Indigo (padrão)                │        │
│         │                                               │        │
│         │                  [Cancelar]  [Criar site →]  │        │
│         └───────────────────────────────────────────────┘        │
└───────────────────────────────────────────────────────────────────┘
```

### Campos

| Campo        | Tipo     | Validação                                              |
|--------------|----------|--------------------------------------------------------|
| name         | text     | Obrigatório, 2-100 chars                               |
| slug         | text     | Obrigatório, único no workspace, formato: a-z0-9-      |
| description  | textarea | Opcional, max 500 chars                                |
| language     | select   | Obrigatório, default "pt-BR"                           |
| primaryColor | color    | Opcional, default "#6366f1"                            |

### Comportamento do Slug

- Gerado automaticamente ao digitar o nome (slugify)
- Editável manualmente após o usuário clicar no campo
- Validação em tempo real (debounce 500ms) verifica unicidade no workspace
- Se slug já existe: "Este endereço já está em uso"

### Após Criar

Redirecionar para `/app/sites/[newSiteId]/pages` com toast:
"Site criado com sucesso! Agora crie sua primeira página."

---

## Tela: Configurações do Site

**Rota:** `/app/sites/[siteId]/settings`  
**Layout:** Admin com layout container  
**Acesso:** Autenticado + dono do site

### Tabs

```
[Geral] [Aparência] [Domínio] [Avançado]
─────
```

### Tab: Geral

```
Nome do site *
[Studio Web Way]

Slug *
[studio-web-way]

Descrição
[...]

Idioma *
[Português (BR) ▼]

Fuso horário *
[América/São Paulo ▼]

──────────────────────────
Status do site

○ Rascunho — Site não acessível ao público
● Publicado — Site acessível em /s/studio-web-way
○ Arquivado — Site desativado

──────────────────────────
[Salvar alterações]
```

### Tab: Aparência

```
Logo do site
[Upload área / preview]    [Remover]

Favicon
[Upload área / preview]    [Remover]

Cor primária
[color picker]  #6366f1

──────────────────────────
[Salvar alterações]
```

Upload de logo: max 2MB, formatos: PNG, JPG, SVG, WEBP.
Upload de favicon: max 500KB, formatos: ICO, PNG.

### Tab: Domínio

```
[Info] Esta funcionalidade estará disponível em breve.

Domínio atual:
https://webway.app/s/studio-web-way

Domínio personalizado (em breve):
[cliente.com]
[Verificar domínio]
```

### Tab: Avançado

```
Google Site Verification
[                              ]
Cole o meta tag ou código de verificação

Código de rastreamento (futuramente)
[                              ]

──────────────────────────────────
Zona de perigo

[Arquivar site]    [Excluir site]
```

Excluir site: confirmar via modal digitando o nome do site.

---

## Visão Geral do Site (redirect)

**Rota:** `/app/sites/[siteId]`  
Redireciona para `/app/sites/[siteId]/pages` (ação mais comum).
