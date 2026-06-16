# Editor Visual de Blocos — Especificação

**Rota:** `/app/sites/[siteId]/pages/[pageId]/editor`  
**Layout:** Editor exclusivo (sem sidebar global, sem topbar global)  
**Acesso:** Autenticado + dono do site

---

## Visão Geral

O editor é a funcionalidade central da Web Way. Permite construir páginas visualmente através de blocos configuráveis. Cada bloco tem um tipo, props editáveis e é persistido como JSON no banco.

---

## Layout Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Studio Web Way / Páginas    Sobre nós*    [👁] [Salvar] [Publicar]│ ← EditorTopbar
├───────────────┬───────────────────────────────────┬─────────────────┤
│               │                                   │                 │
│  BLOCOS       │          CANVAS                   │  PROPRIEDADES   │
│  ─────────    │                                   │  ─────────────  │
│               │  ┌────────────────────────────┐   │                 │
│  Estrutura    │  │                            │   │  Selecione um   │
│  ○ Hero       │  │   ┌──────────────────────┐ │   │  bloco para     │
│  ○ Texto      │  │   │ [Hero]  ↑ ↓ ⊕ 🗑   │ │   │  editar         │
│  ○ Imagem     │  │   │                      │ │   │                 │
│  ○ Features   │  │   │  Headline aqui       │ │   │                 │
│  ○ CTA        │  │   │  Subtítulo aqui      │ │   │                 │
│               │  │   │  [CTA]               │ │   │                 │
│  Conteúdo     │  │   └──────────────────────┘ │   │                 │
│  ○ Testemunhos│  │                            │   │                 │
│  ○ FAQ        │  │   ┌──────────────────────┐ │   │                 │
│  ○ Contato    │  │   │ [Texto] ↑ ↓ ⊕ 🗑   │ │   │                 │
│               │  │   │                      │ │   │                 │
│  Mídia        │  │   │  Título              │ │   │                 │
│  ○ Imagem     │  │   │  Parágrafo...        │ │   │                 │
│               │  │   └──────────────────────┘ │   │                 │
│               │  │                            │   │                 │
│               │  │   [+ Adicionar bloco]      │   │                 │
│               │  └────────────────────────────┘   │                 │
│               │                                   │                 │
│               │   [💻] [📱] [Tablet]              │                 │
└───────────────┴───────────────────────────────────┴─────────────────┘
```

---

## EditorTopbar

```tsx
// Componente: EditorTopbar
// Campos:
// - siteName: string (link para /app/sites/[id]/pages)
// - pageName: string
// - isDirty: boolean (asterisco * quando há alterações não salvas)
// - publishStatus: "draft" | "published"
// - isSaving: boolean
// - isPublishing: boolean

// Ações:
// - onBack: volta para lista de páginas
// - onPreview: abre aba nova com /s/[siteSlug]/[pageSlug]?preview=true
// - onSaveDraft: salva blocos como rascunho
// - onPublish: publica a página (ou atualiza se já publicada)
```

**Estado do botão Salvar:**
- Normal: "Salvar"
- Loading: spinner + "Salvando..."
- Salvo: "Salvo ✓" por 2s

**Estado do botão Publicar:**
- Rascunho nunca publicado: "Publicar" (primary)
- Publicado sem alterações: "Publicado ✓" (success, disabled)
- Publicado com alterações não salvas: "Atualizar" (primary)
- Loading: "Publicando..."

---

## Block Library (Sidebar Esquerda, 240px)

### Categorias de Blocos

```
ESTRUTURA
  Hero
  Texto e Imagem
  Colunas (futuro)

CONTEÚDO
  Texto
  Imagem
  Galeria (futuro)
  Feature Grid
  CTA
  Depoimentos
  FAQ

INTERAÇÃO
  Contato
  Formulário (futuro)
  Mapa (futuro)
```

### BlockLibraryItem

```tsx
// Thumbnail visual do bloco + label + description
// Clique: adiciona bloco ao final da lista
// Drag: permite arrastar para posição específica (futuro)
```

---

## Canvas (Área Central)

### Comportamento

1. Lista de blocos renderizados em ordem
2. Bloco selecionado: borda azul + toolbar flutuante no topo
3. Clicar fora de todos os blocos: deseleciona
4. Estado vazio: mensagem "Clique em um bloco para adicionar"

### BlockWrapper

Cada bloco no canvas é envolto pelo `BlockWrapper`:

```tsx
// Toolbar do bloco (aparece em hover/selected):
// [tipo]  [↑ Mover acima]  [↓ Mover abaixo]  [⊕ Duplicar]  [🗑 Remover]
```

### Inserção de Bloco

Entre dois blocos, aparece linha com "+" ao hover:
```
─────────────────── [+] ───────────────────
```

---

## Properties Panel (Sidebar Direita, 320px)

### Estado sem bloco selecionado

```
[Cursor icon]
Selecione um bloco
para editar suas
propriedades
```

### Estado com bloco selecionado

Header do panel:
```
[Tipo do bloco]                         [×]
──────────────────────────────────────
```

Formulário específico por tipo de bloco.

---

## Especificação dos Blocos

### HeroBlock

**Props:**

| Campo        | Tipo   | Default                        | Descrição                |
|--------------|--------|--------------------------------|--------------------------|
| headline     | string | "Crie seu site com a Web Way"  | Título principal (H1)    |
| subheadline  | string | "Uma forma moderna..."         | Subtítulo                |
| eyebrow      | string | ""                             | Texto pequeno acima do H1|
| buttonText   | string | "Começar agora"                | Texto do botão CTA       |
| buttonUrl    | string | "#"                            | URL do botão             |
| imageUrl     | string | ""                             | Imagem lateral/fundo     |
| alignment    | enum   | "center"                       | "left" ou "center"       |
| bgColor      | string | "transparent"                  | Cor de fundo             |

**Editor do Hero (PropertiesPanel):**
```
Conteúdo
  Eyebrow: [...]
  Headline: [...]
  Subheadline: [... textarea ...]

Botão
  Texto: [...]     URL: [...]

Imagem
  [MediaPicker]

Layout
  Alinhamento: ○ Esquerda  ● Centro

Aparência
  Cor de fundo: [color picker]
```

**Renderização pública:**
- H1 tag para a headline (apenas 1 por página)
- Imagem com loading="eager" se for o primeiro bloco

---

### TextBlock

**Props:**

| Campo     | Tipo   | Default        |
|-----------|--------|----------------|
| title     | string | "Título"       |
| content   | string | "Conteúdo..."  |
| alignment | enum   | "left"         |

**Renderização:** H2 para title, `<p>` para content.

---

### ImageBlock

**Props:**

| Campo       | Tipo   | Default |
|-------------|--------|---------|
| imageUrl    | string | ""      |
| altText     | string | ""      |
| caption     | string | ""      |
| aspectRatio | enum   | "16:9"  |

**Renderização:** `<figure>` + `<img>` + `<figcaption>`. Alt text obrigatório para SEO/acessibilidade.

---

### FeatureGridBlock

**Props:**

| Campo       | Tipo                             |
|-------------|----------------------------------|
| title       | string                           |
| description | string                           |
| features    | Array<{ title, description, icon }> |

**Default:** 3 features.  
**Renderização:** Grid 3 colunas (desktop), 1 coluna (mobile).

---

### CTASectionBlock

**Props:**

| Campo       | Tipo   |
|-------------|--------|
| title       | string |
| description | string |
| buttonText  | string |
| buttonUrl   | string |
| bgColor     | string |

**Renderização:** Seção de destaque, bg colorida.

---

### ContactBlock

**Props:**

| Campo       | Tipo   |
|-------------|--------|
| title       | string |
| description | string |
| email       | string |
| phone       | string |
| address     | string |

**Renderização:** Section com informações de contato. Links `mailto:` e `tel:`.

---

### FAQBlock

**Props:**

| Campo | Tipo                           |
|-------|--------------------------------|
| title | string                         |
| items | Array<{ question, answer }>    |

**Renderização:** Accordion. JSON-LD FAQPage gerado automaticamente.

---

### TestimonialsBlock

**Props:**

| Campo        | Tipo                                          |
|--------------|-----------------------------------------------|
| title        | string                                        |
| testimonials | Array<{ name, role, content, avatarUrl }>     |

**Renderização:** Grid de cards de depoimento.

---

## Estrutura JSON dos Blocos

```json
[
  {
    "id": "block_abc123",
    "type": "hero",
    "props": {
      "headline": "Crie seu site com a Web Way",
      "subheadline": "Uma forma moderna de publicar...",
      "buttonText": "Começar agora",
      "buttonUrl": "/signup",
      "alignment": "center",
      "imageUrl": "",
      "eyebrow": "Novo"
    }
  },
  {
    "id": "block_def456",
    "type": "feature-grid",
    "props": {
      "title": "Por que Web Way?",
      "description": "Tudo que você precisa para criar sites profissionais",
      "features": [
        { "title": "Rápido", "description": "SSR/SSG nativo", "icon": "zap" },
        { "title": "SEO", "description": "Técnico desde o início", "icon": "search" },
        { "title": "Seguro", "description": "Sem plugins inseguros", "icon": "shield" }
      ]
    }
  }
]
```

---

## Autosave

- Salvar automaticamente a cada 30 segundos se houver alterações
- Indicador no topbar: "Salvando..." / "Salvo"
- Não salvar se não houver alterações desde o último save

---

## Atalhos de Teclado do Editor

| Atalho        | Ação                        |
|---------------|-----------------------------|
| Ctrl+S        | Salvar rascunho             |
| Ctrl+Z        | Desfazer (futuro)           |
| Ctrl+Y        | Refazer (futuro)            |
| Escape        | Desselecionar bloco         |
| Delete        | Remover bloco selecionado   |

---

## Preview Responsivo

Botões no rodapé do canvas:
```
[💻 Desktop]  [📱 Mobile]  [Tablet]
```

- Desktop: canvas full width
- Tablet: canvas 768px, centralizado
- Mobile: canvas 375px, centralizado

---

## Estados do Editor

| Estado               | Descrição                                |
|----------------------|------------------------------------------|
| loading              | Carregando página do banco               |
| empty                | Página sem blocos                        |
| editing              | Bloco selecionado, panel visível         |
| saving               | Persistindo no banco                     |
| saved                | Confirmação breve "Salvo ✓"              |
| publishing           | Publicando                               |
| published            | Confirmação + botão "Publicado ✓"        |
| error                | Toast de erro                            |
| preview              | Abre tab com preview público             |
