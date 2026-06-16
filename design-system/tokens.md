# Design Tokens — Web Way

> Tokens são a fonte única da verdade para valores visuais. Todos os componentes devem referenciar tokens, nunca valores hardcoded.

---

## Cores

### Paleta Base

```css
/* Primary — Indigo */
--color-primary-50:  #eef2ff;
--color-primary-100: #e0e7ff;
--color-primary-200: #c7d2fe;
--color-primary-300: #a5b4fc;
--color-primary-400: #818cf8;
--color-primary-500: #6366f1;  /* base */
--color-primary-600: #4f46e5;  /* hover */
--color-primary-700: #4338ca;  /* active */
--color-primary-800: #3730a3;
--color-primary-900: #312e81;
--color-primary-950: #1e1b4b;

/* Secondary — Cyan */
--color-secondary-50:  #ecfeff;
--color-secondary-100: #cffafe;
--color-secondary-200: #a5f3fc;
--color-secondary-300: #67e8f9;
--color-secondary-400: #22d3ee;
--color-secondary-500: #06b6d4;  /* base */
--color-secondary-600: #0891b2;  /* hover */
--color-secondary-700: #0e7490;
--color-secondary-800: #155e75;
--color-secondary-900: #164e63;

/* Neutral */
--color-neutral-0:   #ffffff;
--color-neutral-50:  #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-200: #e2e8f0;
--color-neutral-300: #cbd5e1;
--color-neutral-400: #94a3b8;
--color-neutral-500: #64748b;
--color-neutral-600: #475569;
--color-neutral-700: #334155;
--color-neutral-800: #1e293b;
--color-neutral-900: #0f172a;
--color-neutral-950: #020617;

/* Semantic — Success */
--color-success-50:  #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Semantic — Warning */
--color-warning-50:  #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Semantic — Error */
--color-error-50:  #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Semantic — Info */
--color-info-50:  #eff6ff;
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

### Aliases Semânticos — Tema Claro

```css
/* Backgrounds */
--bg-app:        var(--color-neutral-50);   /* fundo do app */
--bg-surface:    var(--color-neutral-0);    /* cards, modais */
--bg-sunken:     var(--color-neutral-100);  /* inputs, áreas internas */
--bg-overlay:    rgba(0,0,0,0.5);          /* overlays */

/* Bordas */
--border-default: var(--color-neutral-200);
--border-strong:  var(--color-neutral-300);
--border-focus:   var(--color-primary-500);

/* Textos */
--text-primary:   var(--color-neutral-900);
--text-secondary: var(--color-neutral-600);
--text-tertiary:  var(--color-neutral-400);
--text-inverse:   var(--color-neutral-0);
--text-disabled:  var(--color-neutral-300);
--text-link:      var(--color-primary-600);

/* Interativos */
--interactive-primary:       var(--color-primary-500);
--interactive-primary-hover: var(--color-primary-600);
--interactive-primary-text:  var(--color-neutral-0);
```

### Aliases Semânticos — Tema Escuro

```css
/* Backgrounds */
--bg-app:        var(--color-neutral-950);
--bg-surface:    var(--color-neutral-900);
--bg-sunken:     var(--color-neutral-800);

/* Bordas */
--border-default: var(--color-neutral-700);
--border-strong:  var(--color-neutral-600);

/* Textos */
--text-primary:   var(--color-neutral-50);
--text-secondary: var(--color-neutral-400);
--text-tertiary:  var(--color-neutral-600);
```

---

## Tipografia

### Fonte

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Escala de Tamanhos

```css
--text-xs:   0.75rem;   /* 12px — labels, captions */
--text-sm:   0.875rem;  /* 14px — texto UI padrão */
--text-base: 1rem;      /* 16px — corpo de texto */
--text-lg:   1.125rem;  /* 18px — subtítulos pequenos */
--text-xl:   1.25rem;   /* 20px — subtítulos */
--text-2xl:  1.5rem;    /* 24px — títulos de seção */
--text-3xl:  1.875rem;  /* 30px — títulos de página */
--text-4xl:  2.25rem;   /* 36px — hero */
--text-5xl:  3rem;      /* 48px — hero grande */
```

### Pesos

```css
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### Line Heights

```css
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Hierarquia Tipográfica

| Elemento       | Tamanho  | Peso       | Cor            |
|----------------|----------|------------|----------------|
| H1 (página)    | 3xl      | bold       | text-primary   |
| H2 (seção)     | 2xl      | semibold   | text-primary   |
| H3 (subsection)| xl       | semibold   | text-primary   |
| H4             | lg       | semibold   | text-primary   |
| Body           | base     | normal     | text-primary   |
| Body SM        | sm       | normal     | text-secondary |
| Caption        | xs       | normal     | text-tertiary  |
| Label          | sm       | medium     | text-secondary |
| Code           | sm (mono)| normal     | text-primary   |

---

## Espaçamento

Sistema baseado em múltiplos de 4px (escala Tailwind padrão).

```css
--space-0:   0px;
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
```

### Usos Padrão

| Contexto                  | Token     |
|---------------------------|-----------|
| Padding interno de card   | space-6   |
| Gap entre cards           | space-6   |
| Padding de seção de página| space-8   |
| Padding de modal          | space-6   |
| Gap entre form fields     | space-4   |
| Padding de button SM      | space-2 x space-3 |
| Padding de button MD      | space-2.5 x space-4 |
| Padding de button LG      | space-3 x space-6 |
| Gap entre itens de sidebar| space-1   |
| Altura da topbar          | 64px      |
| Largura da sidebar        | 260px     |
| Largura sidebar compacta  | 72px      |

---

## Bordas e Raios

```css
--radius-sm:   4px;    /* inputs, badges */
--radius-md:   8px;    /* cards, modais */
--radius-lg:   12px;   /* cards grandes */
--radius-xl:   16px;   /* modais grandes */
--radius-full: 9999px; /* pills, avatars */
```

---

## Sombras

```css
--shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 10px -6px rgb(0 0 0 / 0.07);
--shadow-focus: 0 0 0 3px rgb(99 102 241 / 0.2);  /* primary focus ring */
```

---

## Z-Index

```css
--z-dropdown:  1000;
--z-sticky:    1100;
--z-modal:     1300;
--z-toast:     1400;
--z-tooltip:   1500;
```

---

## Breakpoints

```css
--screen-sm:  640px;
--screen-md:  768px;
--screen-lg:  1024px;
--screen-xl:  1280px;
--screen-2xl: 1536px;
```

---

## Transições

```css
--transition-fast:   150ms ease;
--transition-normal: 200ms ease;
--transition-slow:   300ms ease-in-out;
```

---

## Ícones

Biblioteca: **Lucide React**

Tamanhos padrão:
- Inline com texto: 16px (w-4 h-4)
- Botões: 16px (w-4 h-4)
- Topbar: 20px (w-5 h-5)
- Empty states: 48px (w-12 h-12)
- Feature icons: 24px (w-6 h-6)
