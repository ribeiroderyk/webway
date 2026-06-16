# Páginas — Especificação de Telas

---

## Tela: Lista de Páginas

**Rota:** `/app/sites/[siteId]/pages`  
**Layout:** Admin padrão  
**Acesso:** Autenticado + dono do site

### Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ Sites / Studio Web Way / Páginas                                  │
│ Páginas                                      [+ Nova Página]      │
│ Gerencie as páginas de Studio Web Way                             │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [🔍 Buscar páginas...]                      [Status ▼]       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Nome              │ Status      │ SEO   │ Atualizado  │ Ações │ │
│ ├───────────────────┼─────────────┼───────┼─────────────┼───────┤ │
│ │ 🏠 Home           │ ● Publicado │ 92%   │ há 2h       │ [⋯]  │ │
│ │    /              │             │       │             │       │ │
│ ├───────────────────┼─────────────┼───────┼─────────────┼───────┤ │
│ │ Sobre nós         │ ● Publicado │ 78%   │ há 1 dia    │ [⋯]  │ │
│ │    /sobre         │             │       │             │       │ │
│ ├───────────────────┼─────────────┼───────┼─────────────┼───────┤ │
│ │ Contato           │ ○ Rascunho  │ 45%   │ há 3 dias   │ [⋯]  │ │
│ │    /contato       │             │       │             │       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│                           1-3 de 3 páginas                       │
└───────────────────────────────────────────────────────────────────┘
```

### Colunas da Tabela

| Coluna      | Descrição                                          |
|-------------|----------------------------------------------------|
| Nome        | Título da página + slug abaixo                     |
| Status      | PublishStatusBadge                                 |
| SEO         | Score % em cor (verde/amarelo/vermelho)            |
| Atualizado  | RelativeTime com tooltip de data completa         |
| Ações       | Ícone ⋯ que abre DropdownMenu                     |

### Menu de Ações da Linha (⋯)

- Abrir editor
- Editar SEO (abre Drawer lateral)
- Duplicar página
- Visualizar página pública
- Despublicar / Publicar
- Excluir (confirmar)

### Linha Clicável

Clicar em qualquer área da linha (fora do menu ⋯) abre o editor.

### Estado Vazio

```
[FileText icon]
Nenhuma página criada
Comece criando a página inicial do seu site.
[+ Criar página inicial]
```

---

## Modal: Nova Página

Aberto ao clicar "+ Nova Página".

```
┌───────────────────────────────────────────────┐
│  Nova Página                              [×] │
│  ─────────────────────────────────────────    │
│                                               │
│  Título da página *                           │
│  [Sobre nós                               ]   │
│                                               │
│  Slug (URL) *                                 │
│  /s/studio-web-way/ [sobre-nos           ]    │
│  Gerado automaticamente                       │
│                                               │
│  Iniciar com template?                        │
│  ○ Página em branco (padrão)                  │
│  ○ Landing Page                               │
│  ○ Sobre nós                                  │
│  ○ Contato                                    │
│                                               │
│                   [Cancelar]  [Criar →]       │
└───────────────────────────────────────────────┘
```

Após criar: redirecionar para o editor da nova página.

---

## Drawer: Editar SEO da Página

Aberto via "Editar SEO" no menu de ações.

```
┌─────────────────────────────────────────────────────┐
│ [×] SEO — Sobre nós                                 │
│                                                     │
│ TABS: [Básico] [Social] [Avançado]                  │
│ ────────────────────────────                        │
│                                                     │
│ [SEOPreview component]                              │
│                                                     │
│ Título SEO                                          │
│ [Sobre nós - Studio Web Way              ] 32/60    │
│                                                     │
│ Descrição SEO                                       │
│ [Conheça nossa equipe e nossa missão...  ] 52/160   │
│ [                                        ]          │
│                                                     │
│ URL Canônica                                        │
│ [https://webway.app/s/studio/sobre       ]          │
│ Pré-preenchida automaticamente                      │
│                                                     │
│ Indexação                                           │
│ ☑ Indexar esta página no Google                    │
│ ☑ Seguir links desta página                        │
│                                                     │
│                        [Cancelar] [Salvar SEO]      │
└─────────────────────────────────────────────────────┘
```

Tab Social:
```
Open Graph Title
[...]

Open Graph Description
[...]

Imagem Open Graph
[Selecionar imagem]  [Preview]
```

Tab Avançado:
```
Robots customizado
[index, follow]

Schema Type (JSON-LD)
[WebPage ▼]
```

---

## Tela: Editor de Página (redirect)

Spec completa em [06-editor.md](06-editor.md).

**Rota:** `/app/sites/[siteId]/pages/[pageId]/editor`

---

## Dados das Páginas

### Campos exibidos na listagem

```ts
interface PageListItem {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  seoScore: number | null;   // calculado pelo seoService
  updatedAt: Date;
  publishedAt: Date | null;
}
```

### Permissões

- Apenas o owner do workspace pode criar/editar/excluir páginas
- Páginas de sites de outros workspaces: 403

### Regras de Negócio

- Slug único por site (não por plataforma)
- Slug `/` é reservado para a home do site
- Não pode excluir página publicada sem despublicar antes (soft rule — aviso)
- Máximo de 100 páginas por site no MVP
