# Editor Components — Web Way Design System

---

## Editor Layout

O editor de blocos tem layout próprio, sem a sidebar global do admin.

```
┌─────────────────────────────────────────────────────────────┐
│  [← Páginas] Home — Studio Web Way     [Pré-visualizar]    │
│                              [Salvar Rascunho] [Publicar]   │
├───────────────┬─────────────────────────────┬───────────────┤
│               │                             │               │
│  BLOCOS       │      CANVAS                 │  PROPRIEDADES │
│  DISPONÍVEIS  │                             │               │
│               │  ┌───────────────────────┐  │               │
│ Estrutura     │  │  [HeroBlock]          │  │  Selecione um │
│ ─ Hero        │  │                       │  │  bloco para   │
│ ─ Texto       │  │  [TextBlock]          │  │  editar suas  │
│ ─ Imagem      │  │                       │  │  propriedades │
│ ─ Features    │  │  [CTABlock]           │  │               │
│ ─ CTA         │  │                       │  │               │
│               │  └───────────────────────┘  │               │
│ Mídia         │                             │               │
│ ─ Imagem      │  [+ Adicionar bloco]        │               │
│ ─ Galeria     │                             │               │
│               │                             │               │
│ Social        │  [D] [M] [P]               │               │
│ ─ Depoimentos │  Desktop/Mobile/Tablet      │               │
└───────────────┴─────────────────────────────┴───────────────┘
```

---

## EditorTopbar

Barra superior exclusiva do editor.

```tsx
<EditorTopbar
  pageName="Home"
  siteName="Studio Web Way"
  isDirty={hasUnsavedChanges}
  onBack={() => router.push(`/app/sites/${siteId}/pages`)}
  onPreview={handlePreview}
  onSaveDraft={handleSaveDraft}
  onPublish={handlePublish}
  publishStatus={page.status}
/>
```

Estados do botão Publicar:
- Rascunho: "Publicar" (primary)
- Publicado sem alterações: "Publicado ✓" (success, disabled)
- Publicado com alterações: "Atualizar" (primary)
- Loading: spinner

---

## BlockLibrary (Sidebar Esquerda)

```
┌─────────────────────────┐
│ [🔍 Buscar blocos...]   │
│                         │
│ ESTRUTURA               │
│ ┌─────────────────────┐ │
│ │ [█████] Hero        │ │
│ │ Cabeçalho com CTA   │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ [████░] Texto       │ │
│ │ Título e parágrafo  │ │
│ └─────────────────────┘ │
│                         │
│ MÍDIA                   │
│ ┌─────────────────────┐ │
│ │ [🖼] Imagem         │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

Clique no bloco ou arrastar para o canvas.

### BlockLibraryItem

```tsx
<BlockLibraryItem
  type="hero"
  label="Hero"
  description="Cabeçalho com CTA"
  icon={<Layout />}
  onAdd={() => addBlock({ type: "hero", props: heroDefaults })}
/>
```

---

## Canvas (Área Central)

- Fundo: neutral-100 (quadriculado sutil)
- Blocos renderizados em sequência vertical
- Bloco selecionado: borda primary-500 + handles de controle
- Hover em bloco: borda dashed neutral-300

### BlockWrapper (Envoltório de cada bloco)

```
┌─────────────────────────────────────────────┐
│ [≡] [Hero]  ──────────────  [↑][↓][⊕][🗑] │  ← toolbar do bloco
├─────────────────────────────────────────────┤
│                                             │
│  [Conteúdo renderizado do bloco]            │
│                                             │
└─────────────────────────────────────────────┘
```

Toolbar aparece em hover ou quando o bloco está selecionado.

```tsx
<BlockWrapper
  blockId={block.id}
  blockType={block.type}
  isSelected={selectedBlockId === block.id}
  onSelect={() => setSelectedBlockId(block.id)}
  onMoveUp={() => moveBlock(block.id, "up")}
  onMoveDown={() => moveBlock(block.id, "down")}
  onDuplicate={() => duplicateBlock(block.id)}
  onDelete={() => deleteBlock(block.id)}
>
  <BlockRenderer block={block} mode="canvas" />
</BlockWrapper>
```

---

## PropertiesPanel (Sidebar Direita)

Exibe formulário de edição do bloco selecionado.

```
┌──────────────────────────────────┐
│  Hero Block                  [×] │
│  ────────────────────────────    │
│                                  │
│  Conteúdo                        │
│  ┌──────────────────────────┐    │
│  │ Headline                 │    │
│  │ [Crie seu site com...]   │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ Subheadline              │    │
│  │ [Uma forma moderna...]   │    │
│  └──────────────────────────┘    │
│                                  │
│  Botão                           │
│  [Texto]  [URL]                  │
│                                  │
│  Layout                          │
│  ○ Esquerda  ● Centro            │
│                                  │
│  Imagem                          │
│  [Selecionar imagem]             │
└──────────────────────────────────┘
```

Sem botão de salvar no panel — edição é aplicada ao estado em tempo real.
O botão "Salvar Rascunho" na topbar persiste todas as alterações.

---

## Viewport Switcher

```tsx
<ViewportSwitcher
  value={viewport}
  onChange={setViewport}
  options={["desktop", "tablet", "mobile"]}
/>
```

Widths simulados:
- Desktop: 100% do canvas
- Tablet: 768px centralizado
- Mobile: 375px centralizado

---

## AddBlockButton

Botão entre blocos para inserir novos.

```
─────────────────────────────────
        [+ Adicionar bloco]
─────────────────────────────────
```

Aparece no final da lista e ao hover entre blocos.
