# Cards — Web Way Design System

---

## Card Base

```
┌──────────────────────────────┐  ← border-radius: radius-md
│                              │  ← shadow-md
│  [Header]                    │  ← padding: space-6
│  [Content]                   │
│  [Footer]                    │
└──────────────────────────────┘
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

## StatCard

Card de métrica única para o Dashboard.

```
┌─────────────────────────────┐
│ [Icon bg-primary-50]        │
│                             │
│ 24                          │  ← número grande (text-3xl bold)
│ Sites publicados            │  ← label (text-sm secondary)
│                             │
│ ↑ 3 este mês                │  ← trend (text-xs success/error)
└─────────────────────────────┘
```

```tsx
<StatCard
  title="Sites publicados"
  value={24}
  icon={<Globe />}
  iconBg="primary"
  trend={{ value: 3, label: "este mês", direction: "up" }}
/>
```

Cores do `iconBg`:
- `primary` → bg-primary-50, icon primary-600
- `success` → bg-success-50, icon success-600
- `warning` → bg-warning-50, icon warning-600
- `error`   → bg-error-50,   icon error-600
- `info`    → bg-info-50,    icon info-600

---

## SiteCard

Card de site na listagem.

```
┌──────────────────────────────────┐
│ [favicon] Nome do Site    [•••]  │  ← header com menu
│ exemplo.webway.app               │  ← url (text-xs secondary)
├──────────────────────────────────┤
│ 12 páginas  |  5 posts           │  ← stats
│ Publicado há 2 dias              │  ← meta
├──────────────────────────────────┤
│ [Publicado ▼]   [Ver] [Editar]   │  ← footer com status e ações
└──────────────────────────────────┘
```

---

## PageCard

Card de página na listagem.

```
┌──────────────────────────────────┐
│ Sobre nós              [•••]     │
│ /sobre                           │
├──────────────────────────────────┤
│ [Publicado] [SEO: 85%]           │
│ Atualizado: 10/06/2026           │
└──────────────────────────────────┘
```

---

## PostCard

Card de post de blog.

```
┌──────────────────────────────────┐
│ [cover image]                    │
│                                  │
│ Como criar sites rápidos         │  ← title
│ 5 min de leitura | João Silva    │  ← meta
│                                  │
│ [Publicado] [SEO: 90%]           │
│ [Editar]  [Ver]  [Duplicar]      │
└──────────────────────────────────┘
```

---

## MediaCard

Card de arquivo de mídia na galeria.

```
┌────────────────┐
│                │
│   [preview]    │  ← imagem ou ícone de tipo
│                │
├────────────────┤
│ nome-arquivo   │  ← truncado
│ 256 KB · JPG   │  ← tamanho e tipo
└────────────────┘
```

Selecionado: borda primary-500, overlay com checkmark.

---

## TemplateCard

Card de template na galeria.

```
┌──────────────────────────────────┐
│ [thumbnail preview]              │
│                                  │
├──────────────────────────────────┤
│ Landing Page Agência             │
│ Landing Page · 5 blocos          │
│ [Usar este template]             │
└──────────────────────────────────┘
```

---

## FileCard

Card de arquivo para upload e download.

```
┌──────────────────────────────────┐
│ [📄] nome-do-arquivo.pdf   [↓]  │
│       2.4 MB                     │
└──────────────────────────────────┘
```

---

## EmptyState (Card de Estado Vazio)

```
┌──────────────────────────────────┐
│                                  │
│         [Icon grande]            │
│                                  │
│     Nenhum site criado           │  ← title
│   Crie seu primeiro site para    │  ← description
│   começar a publicar conteúdo.   │
│                                  │
│      [+ Criar primeiro site]     │  ← CTA
│                                  │
└──────────────────────────────────┘
```

Ícone: 48px, cor neutral-300.
Título: text-lg semibold text-secondary.
Descrição: text-sm text-tertiary, max-w-sm, centralizado.

---

## SEOPreview Card

Simula resultado de busca Google.

```
┌──────────────────────────────────────────────┐
│ Prévia no Google                             │
│                                              │
│ exemplo.webway.app › sobre                   │  ← URL (verde)
│ Sobre nós - Nome do Site                     │  ← Title (azul, text-lg)
│ Conheça nossa história e missão. Trabalhamos │  ← Description (cinza)
│ com agências e freelancers desde 2020.       │
│                                              │
│ ⚠ Título muito longo (65 chars / max 60)     │  ← warnings
└──────────────────────────────────────────────┘
```

---

## ChecklistCard

Card de checklist de configuração/SEO.

```
┌──────────────────────────────────┐
│ Checklist SEO          85%       │
│ ████████████░░░                  │
│                                  │
│ ✅ Título preenchido             │
│ ✅ Descrição preenchida          │
│ ✅ H1 único                      │
│ ⚠️  Imagem sem alt text          │
│ ❌ Open Graph não configurado    │
└──────────────────────────────────┘
```
