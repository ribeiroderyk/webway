# Templates — Especificação

---

## Tela: Galeria de Templates

**Rota:** `/app/templates`  
**Layout:** Admin padrão  
**Acesso:** Autenticado

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ Templates                                                         │
│ Comece com um template pronto e personalize                       │
│                                                                   │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [🔍 Buscar templates...]         [Categoria ▼]             │   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│ [Todos] [Landing Page] [Blog] [Portfólio] [Institucional]        │  ← filter tabs
│                                                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐         │
│ │ [thumbnail]    │ │ [thumbnail]    │ │ [thumbnail]    │         │
│ │                │ │                │ │                │         │
│ ├────────────────┤ ├────────────────┤ ├────────────────┤         │
│ │ Landing Page   │ │ Blog Pessoal   │ │ Portfólio      │         │
│ │ Agência        │ │                │ │ Criativo       │         │
│ │ 6 blocos       │ │ 4 blocos       │ │ 5 blocos       │         │
│ │ [Usar template]│ │ [Usar template]│ │ [Usar template]│         │
│ └────────────────┘ └────────────────┘ └────────────────┘         │
│                                                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐         │
│ │ [thumbnail]    │ │ [thumbnail]    │ │ [Em breve]     │         │
│ │                │ │                │ │                │         │
│ ├────────────────┤ ├────────────────┤ ├────────────────┤         │
│ │ Página Sobre   │ │ Contato        │ │ Loja (Fase 5)  │         │
│ │ 3 blocos       │ │ 2 blocos       │ │                │         │
│ │ [Usar template]│ │ [Usar template]│ │ [Em breve]     │         │
│ └────────────────┘ └────────────────┘ └────────────────┘         │
└────────────────────────────────────────────────────────────────────┘
```

---

## Templates Iniciais (Seed)

### 1. Landing Page — Agência

**Categoria:** Landing Page  
**Blocos:**
1. HeroBlock (alinhamento esquerdo, botões CTA)
2. FeatureGridBlock (3 colunas de features)
3. TestimonialsBlock (3 depoimentos)
4. CTASectionBlock (fundo escuro)
5. ContactBlock

### 2. Blog Pessoal

**Categoria:** Blog  
**Blocos:**
1. HeroBlock (alinhamento centro, sem imagem lateral)
2. TextBlock (sobre o autor)
3. CTASectionBlock (subscribe)

### 3. Portfólio Criativo

**Categoria:** Portfólio  
**Blocos:**
1. HeroBlock
2. FeatureGridBlock (projetos)
3. TestimonialsBlock
4. ContactBlock

### 4. Página Sobre

**Categoria:** Página  
**Blocos:**
1. TextBlock (história)
2. FeatureGridBlock (valores)
3. TestimonialsBlock

### 5. Página Contato

**Categoria:** Página  
**Blocos:**
1. HeroBlock (simples)
2. ContactBlock

---

## Modal: Usar Template

```
┌────────────────────────────────────────────────────────┐
│  Usar "Landing Page — Agência"                   [×]  │
│  ──────────────────────────────────────────────────    │
│                                                        │
│  Aplicar template em qual página?                      │
│                                                        │
│  Site *                                                │
│  [Studio Web Way                               ▼]      │
│                                                        │
│  Página *                                              │
│  [Home                                         ▼]      │
│                                                        │
│  ⚠️  O conteúdo atual da página será substituído.     │
│  Esta ação pode ser desfeita no editor.               │
│                                                        │
│                         [Cancelar]  [Aplicar →]        │
└────────────────────────────────────────────────────────┘
```

Após aplicar: redireciona para o editor da página selecionada.

---

## Modelo de Template

```ts
interface Template {
  id: string;
  name: string;
  description: string;
  category: "landing-page" | "blog" | "portfolio" | "institutional" | "page";
  thumbnailUrl: string;
  blocks: Block[];  // mesmo formato JSON do editor
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Templates públicos (`isPublic: true`) são criados no seed e visíveis para todos.

---

## Salvar como Template (Futuro — Fase 4)

Na lista de páginas, menu ⋯ terá opção "Salvar como template".
Isso criará um template privado do workspace.
