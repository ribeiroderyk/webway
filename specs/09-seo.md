# SEO — Especificação de Telas

---

## Tela: SEO do Site

**Rota:** `/app/sites/[siteId]/seo`  
**Layout:** Admin padrão  
**Acesso:** Autenticado + dono do site

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│ Sites / Studio Web Way / SEO                                      │
│ SEO                                                               │
│ Configurações de otimização para buscadores                       │
│                                                                   │
│ [Visão Geral] [Sitemap] [Robots.txt] [Verificação] [Auditoria]    │  ← tabs
│ ────────────────────────────────────────────────────────────────  │
│                                                                   │
│ Saúde SEO do Site                                                 │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │                                                             │  │
│ │  Score Médio                   Problemas                    │  │
│ │  ┌─────────┐                                               │  │
│ │  │  78%    │   ████████████████░░░░                        │  │
│ │  │  Bom    │                                               │  │
│ │  └─────────┘   ✅ 3 páginas com score > 80%                │  │
│ │                ⚠️  2 páginas com avisos                     │  │
│ │                ❌ 1 página com problemas críticos            │  │
│ │                                                             │  │
│ └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
│ Auditoria por Página                                              │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ Página        │ Score │ Problemas                           │  │
│ ├───────────────┼───────┼─────────────────────────────────── │  │
│ │ Home          │  92%  │ ✅ Sem problemas          [Ver]     │  │
│ │ Sobre nós     │  78%  │ ⚠️ OG Image faltando      [Corrigir]│  │
│ │ Contato       │  45%  │ ❌ Sem título SEO          [Corrigir]│  │
│ └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tab: Visão Geral / Configurações Globais

```
Título padrão do site
[Studio Web Way]
Usado quando a página não tem título SEO definido

Separador do título
[ | ▼] (opções: |, -, —, ·, »)

Formato do título
[{page_title} {sep} {site_name}]

Descrição padrão
[...textarea...]
Usada quando a página não tem descrição definida

Idioma do conteúdo
[pt-BR ▼]
Define o atributo lang do HTML

[Salvar configurações]
```

---

## Tab: Sitemap

```
┌─────────────────────────────────────────────────────────────────┐
│ Sitemap XML                                                     │
│                                                                 │
│ URL do sitemap:                                                 │
│ https://webway.app/s/studio-web-way/sitemap.xml  [Copiar]      │
│                                                                 │
│ [Visualizar sitemap] [Regenerar sitemap]                        │
│                                                                 │
│ ─────────────────────────────────────────────                   │
│                                                                 │
│ URLs incluídas (4):                                             │
│ ┌──────────────────────────────────┬────────────┬─────────┐    │
│ │ URL                              │ Atualizado │ Priori. │    │
│ ├──────────────────────────────────┼────────────┼─────────┤    │
│ │ /s/studio-web-way/               │ 15/06/2026 │ 1.0     │    │
│ │ /s/studio-web-way/sobre          │ 10/06/2026 │ 0.8     │    │
│ │ /s/studio-web-way/contato        │ 08/06/2026 │ 0.7     │    │
│ │ /s/studio-web-way/blog/post-1    │ 05/06/2026 │ 0.6     │    │
│ └──────────────────────────────────┴────────────┴─────────┘    │
│                                                                 │
│ Configurações:                                                  │
│ ☑ Incluir páginas publicadas                                    │
│ ☑ Incluir posts publicados                                      │
│ ☐ Incluir imagens (em breve)                                    │
└─────────────────────────────────────────────────────────────────┘
```

O sitemap é gerado dinamicamente pela rota `/s/[siteSlug]/sitemap.xml`.

---

## Tab: Robots.txt

```
┌─────────────────────────────────────────────────────────────────┐
│ Robots.txt                                                      │
│                                                                 │
│ URL: https://webway.app/robots.txt  [Copiar]                   │
│                                                                 │
│ Preview atual:                                                  │
│ ┌─────────────────────────────────────────────┐                │
│ │ User-agent: *                               │                │
│ │ Allow: /s/                                  │                │
│ │ Disallow: /app/                             │                │
│ │ Disallow: /api/                             │                │
│ │                                             │                │
│ │ Sitemap: https://webway.app/sitemap.xml     │                │
│ └─────────────────────────────────────────────┘                │
│                                                                 │
│ Configurações por site:                                         │
│                                                                 │
│ Studio Web Way (publicado):                                     │
│ ● Permitir indexação                                            │
│ ○ Bloquear indexação (noindex)                                  │
│                                                                 │
│ Nota: Sites em rascunho são automaticamente bloqueados.         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tab: Verificação Google

```
┌─────────────────────────────────────────────────────────────────┐
│ Verificação do Google Search Console                            │
│                                                                 │
│ Para verificar a propriedade do site no Google Search Console:  │
│                                                                 │
│ Opção 1: Meta Tag                                               │
│ Cole o código de verificação:                                   │
│ [google-site-verification=xxxxxxxxxxxxx        ]               │
│                                                                 │
│ A meta tag será inserida automaticamente no <head> do site.     │
│                                                                 │
│ Opção 2: Arquivo HTML (instrução)                               │
│ Faça o download do arquivo e coloque em /public                 │
│                                                                 │
│                                      [Salvar verificação]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tab: Auditoria Detalhada

```
┌─────────────────────────────────────────────────────────────────┐
│ Auditoria SEO — Contato                                         │
│                                                                 │
│ Score: 45/100 — Precisa de atenção                              │
│ ████████░░░░░░░░░░░░░                                           │
│                                                                 │
│ Problemas críticos (❌)                                          │
│ ─────────────────────────────                                   │
│ ❌ Título SEO não preenchido                                    │
│    O título SEO é exibido nos resultados do Google.             │
│    [Ir para SEO da página]                                      │
│                                                                 │
│ ❌ Descrição SEO não preenchida                                 │
│    [Ir para SEO da página]                                      │
│                                                                 │
│ Avisos (⚠️)                                                     │
│ ─────────────────────────────                                   │
│ ⚠️ Imagem de destaque sem alt text                              │
│    Adicione texto alternativo à imagem.                         │
│    [Ir para Mídia]                                              │
│                                                                 │
│ Passando (✅)                                                   │
│ ─────────────────────────────                                   │
│ ✅ Slug amigável (/contato)                                     │
│ ✅ Página publicada                                             │
│ ✅ Link canônico presente                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist de Auditoria SEO

Implementado no `seoService.ts`. Avalia cada página/post:

| Check                        | Pontuação | Condição de aprovação                    |
|------------------------------|-----------|------------------------------------------|
| Título SEO preenchido        | 20 pts    | `seoTitle` ou `title` não vazio          |
| Descrição SEO preenchida     | 20 pts    | `seoDescription` não vazio               |
| H1 único                     | 10 pts    | Bloco hero presente na página            |
| Slug amigável                | 10 pts    | Slug sem caracteres especiais, < 60 chars|
| Imagem com alt text          | 10 pts    | Imagens nos blocos com `altText`         |
| Canonical presente           | 5 pts     | Definido automaticamente                 |
| Página publicada             | 5 pts     | `status = "published"`                  |
| Open Graph configurado       | 10 pts    | `ogTitle` e `ogImageUrl` preenchidos    |
| Conteúdo mínimo (300 palavras)| 10 pts   | Contagem de palavras no conteúdo         |

Score total: soma dos pontos / 100.

---

## Sitemap Global da Plataforma

**Rota:** `/sitemap.xml`

Inclui todas as páginas da landing page da Web Way.

**Rota por site:** `/s/[siteSlug]/sitemap.xml`

Inclui páginas e posts publicados do site específico.

---

## Robots.txt Global

**Rota:** `/robots.txt`

Gerado dinamicamente:

```
User-agent: *
Allow: /
Allow: /s/
Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /signup

Sitemap: https://[domain]/sitemap.xml
```
