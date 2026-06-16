# Layout System — Web Way

> Define a estrutura de layout do painel administrativo e das páginas públicas.

---

## Estrutura Geral do Admin

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR (64px)                   │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   SIDEBAR    │         CONTENT AREA                 │
│   (260px)    │                                      │
│              │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Topbar
- **Altura:** 64px fixo
- **Posição:** fixed top-0, full width
- **z-index:** z-sticky (1100)
- **Conteúdo:**
  - Logo Web Way (esquerda)
  - Busca global (centro)
  - Notificações + Avatar + Menu (direita)

### Sidebar
- **Largura expandida:** 260px
- **Largura compacta:** 72px (apenas ícones + tooltips)
- **Posição:** fixed left-0, top-64px, height calc(100vh - 64px)
- **z-index:** z-dropdown (1000)
- **Scroll:** interno com overflow-y-auto
- **Comportamento em mobile:** overlay drawer (z-modal)

### Content Area
- **Margin-left:** 260px (sidebar expandida) ou 72px (compacta)
- **Padding-top:** 64px (topbar)
- **Padding:** 32px
- **Max-width:** 1440px (centralizado com mx-auto quando em layout container)

---

## Layout da Página de Conteúdo

```
┌─────────────────────────────────────────────────┐
│  PageHeader                                      │
│  ┌──────────────────────────────────────────┐   │
│  │ Title          [Actions]                 │   │
│  │ Breadcrumb                               │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  Content                                         │
│  ┌──────────────────────────────────────────┐   │
│  │  [main content area]                     │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Grid

Sistema de 12 colunas com gap de 24px.

```
Mobile (< 768px): 1 coluna
Tablet (768-1024px): 2 colunas
Desktop (>= 1024px): 3-4 colunas
Wide (>= 1280px): até 12 colunas
```

### Layouts de Dashboard Comuns

**4 stat cards:**
```
[card 1] [card 2] [card 3] [card 4]
  col-3    col-3    col-3    col-3
```

**Conteúdo + Sidebar:**
```
[main content]    [sidebar]
    col-8           col-4
```

**Tabela full width:**
```
[table]
 col-12
```

---

## Editor Layout

Layout exclusivo para o editor de blocos:

```
┌─────────────────────────────────────────────────────┐
│                 EDITOR TOPBAR (56px)                │
│  [← Voltar] [Nome da Página]  [Preview][Save][Pub.] │
├──────────────┬──────────────────┬───────────────────┤
│              │                  │                   │
│  BLOCKS      │   CANVAS         │   PROPERTIES      │
│  SIDEBAR     │   AREA           │   PANEL           │
│  (240px)     │   (flex grow)    │   (320px)         │
│              │                  │                   │
└──────────────┴──────────────────┴───────────────────┘
```

---

## Sidebar Navigation

### Estrutura do Menu

```
[Logo] Web Way                    [Toggle]
────────────────────────────────────
[Icon] Dashboard
────────────────────────────────────
CONTEÚDO
[Icon] Sites
[Icon] Páginas
[Icon] Blog
[Icon] Mídia
────────────────────────────────────
FERRAMENTAS
[Icon] SEO
[Icon] Templates
[Icon] Integrações
────────────────────────────────────
CONFIGURAÇÕES
[Icon] Configurações
[Icon] Conta
────────────────────────────────────
[Avatar] Nome do Usuário    [Menu▼]
```

### Estados de Item de Menu

- **Default:** texto secondary, ícone muted
- **Hover:** bg neutral-100 (dark: neutral-800), texto primary
- **Active:** bg primary-50, texto primary-600, borda esquerda primary-500
- **Disabled:** opacidade 0.5

---

## Topbar Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [≡ Toggle] [Logo]  [🔍 Buscar em tudo...]    [🔔] [Avatar▼] │
└─────────────────────────────────────────────────────────────┘
```

Componentes:
- **Toggle:** fecha/abre sidebar (mobile: abre drawer)
- **Logo:** link para /app/dashboard
- **Search:** input expansível, atalho Cmd+K / Ctrl+K
- **Notifications:** ícone com badge de contagem
- **Avatar menu:** foto/iniciais, nome, links para conta e logout

---

## Layout Público (Sites)

Páginas públicas geradas pelo CMS não usam o painel admin.
Cada site tem seu próprio layout baseado nos blocos configurados.

```
┌─────────────────────────────────────┐
│           [SITE HEADER]             │
│   Logo    Nav Links    [CTA]        │
├─────────────────────────────────────┤
│                                     │
│         [BLOCK CONTENT]             │
│   HeroBlock                         │
│   TextBlock                         │
│   FeatureGridBlock                  │
│   ...                               │
│                                     │
├─────────────────────────────────────┤
│           [SITE FOOTER]             │
└─────────────────────────────────────┘
```

---

## Responsividade do Admin

| Breakpoint | Sidebar        | Content          |
|------------|----------------|------------------|
| < 768px    | Oculta (drawer)| Full width       |
| 768-1024px | Compacta (72px)| ml-18            |
| >= 1024px  | Expandida (260px) | ml-65         |

---

## Variações de Layout do Painel

**Layout Full Width:**
- Content area usa 100% da largura disponível
- Adequado para tabelas e editors

**Layout Container:**
- Content area limitada a max-w-5xl (1024px)
- Centralizado com mx-auto
- Adequado para formulários e detalhes

**Layout Editor:**
- 3 colunas fixas (sidebar blocos, canvas, propriedades)
- Sem padding lateral no content area
- Topbar própria sem a sidebar global
