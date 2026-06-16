# SEO Components — Web Way Design System

---

## SEOPreview

Componente que simula a aparência nos resultados do Google.

```
┌────────────────────────────────────────────────────────────────┐
│  Prévia no Google Search                                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ exemplo.webway.app › sobre                               │  │  ← URL (verde #006621)
│  │ Sobre Nós - Studio Web Way | Agência Digital             │  │  ← Title (azul #1a0dab, max 60 chars)
│  │ Conheça a equipe por trás do Studio Web Way. Trabalhamos │  │  ← Description (cinza)
│  │ com agências e criadores desde 2020.                     │  │  ← (max 160 chars)
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Avisos:                                                        │
│  ⚠ Título: 58/60 caracteres (OK)                               │
│  ✅ Descrição: 145/160 caracteres (OK)                         │
└────────────────────────────────────────────────────────────────┘
```

```tsx
<SEOPreview
  title={seoTitle || pageTitle}
  description={seoDescription}
  url={canonicalUrl || `${siteUrl}/${pageSlug}`}
/>
```

---

## SocialPreview

Simula a aparência ao compartilhar em redes sociais.

```
┌────────────────────────────────────────────────────────────────┐
│  Prévia de Compartilhamento                                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │            [OG IMAGE - 1200x630]                         │  │
│  │                                                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ EXEMPLO.WEBWAY.APP                                       │  │
│  │ Sobre Nós - Studio Web Way                               │  │
│  │ Conheça a equipe por trás do Studio Web Way.             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

```tsx
<SocialPreview
  title={ogTitle || seoTitle || pageTitle}
  description={ogDescription || seoDescription}
  imageUrl={ogImageUrl}
  siteName={site.name}
  url={canonicalUrl}
/>
```

---

## SEOForm

Formulário de configuração SEO de uma página ou post.

```tsx
<SEOForm
  value={seoData}
  onChange={setSeoData}
  pageTitle={page.title}
  pageSlug={page.slug}
  siteUrl={site.url}
/>
```

Campos do formulário:

1. **SEO Title** — Input com contador de caracteres (max 60)
2. **Meta Description** — Textarea com contador (max 160)
3. **Canonical URL** — Input (pré-preenchido automaticamente)
4. **Robots** — Checkboxes: Indexar / Seguir links
5. **Open Graph Title** — Input (herdado do SEO Title se vazio)
6. **Open Graph Description** — Textarea (herdado da description)
7. **Open Graph Image** — MediaPicker

---

## SEOAuditChecklist

```
┌────────────────────────────────────────────────────────┐
│  Auditoria SEO                          Score: 78/100  │
│  ████████████████████░░░░░░                            │
│                                                        │
│  ✅ Título SEO preenchido                              │
│  ✅ Descrição SEO preenchida                           │
│  ✅ H1 único na página                                 │
│  ✅ Slug amigável                                      │
│  ⚠️  Imagem de destaque sem alt text                   │
│  ❌ Open Graph não configurado                         │
│  ❌ Conteúdo com menos de 300 palavras                 │
│  ✅ Link canônico definido                             │
│  ✅ Página publicada                                   │
│                                                        │
│  [Corrigir problemas]                                  │
└────────────────────────────────────────────────────────┘
```

```tsx
<SEOAuditChecklist
  checks={auditChecks}
  score={score}
  onFix={(checkId) => handleFix(checkId)}
/>
```

Tipos de check:
- `pass` → ✅ verde
- `warning` → ⚠️ amarelo
- `fail` → ❌ vermelho

---

## RobotsMeta

Exibição do estado de indexação.

```tsx
<RobotsMeta index={robotsIndex} follow={robotsFollow} />
// Renderiza: "index, follow" ou "noindex, follow" etc.
```

---

## SitemapView

Exibição da estrutura do sitemap.

```
┌────────────────────────────────────────────────────────┐
│  Sitemap                            [Atualizar]        │
│  /s/meu-site/sitemap.xml                               │
│                                                        │
│  URLs incluídas:                                       │
│  • /s/meu-site/           — atualizado 10/06/2026      │
│  • /s/meu-site/sobre      — atualizado 08/06/2026      │
│  • /s/meu-site/contato    — atualizado 07/06/2026      │
│  • /s/meu-site/blog/post-1 — atualizado 05/06/2026     │
│                                                        │
│  4 URLs • Gerado: 15/06/2026                           │
└────────────────────────────────────────────────────────┘
```

---

## JsonLdPreview

Visualização do JSON-LD gerado.

```tsx
<JsonLdPreview schema={jsonLdSchema} />
```

Exibe o JSON formatado com syntax highlighting.
Link para validar no Schema.org Validator.

---

## CharacterCounter

Contador usado em campos SEO.

```tsx
<CharacterCounter current={55} max={60} />
// Renderiza: "55/60" em verde quando OK, amarelo ao aproximar, vermelho ao exceder
```

Faixas:
- Verde: até 90% do máximo
- Amarelo: 90-100%
- Vermelho: acima de 100%
