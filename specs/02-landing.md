# Landing Page — Web Way Institucional

**Rota:** `/`  
**Tipo:** Página pública, SSG (gerada estaticamente)  
**Objetivo:** Apresentar e converter visitantes em usuários da plataforma

---

## Estrutura da Página

```
1. Header / Nav
2. Hero Section
3. Social Proof (números)
4. Benefícios
5. Preview do Painel
6. Para Agências
7. SEO Técnico
8. Hospedagem Flexível
9. Comparação (Web Way vs alternativas antigas)
10. Blocos (recursos principais)
11. Roadmap resumido
12. CTA Final
13. Footer
```

---

## 1. Header / Nav

```
┌─────────────────────────────────────────────────────────────────┐
│  [Web Way]   Recursos  Roadmap  Docs          [Login] [Começar] │
└─────────────────────────────────────────────────────────────────┘
```

- Sticky no scroll
- Background: branco com `shadow-sm` após scroll (scroll detection)
- Logo: wordmark "Web Way" em primary-600
- Nav links: texto secondary, hover primary
- Botão Login: secondary
- Botão Começar: primary

---

## 2. Hero Section

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│        🆕 Agora com suporte a domínios próprios                 │  ← eyebrow badge
│                                                                 │
│     A nova forma de criar, editar e                             │
│     publicar sites profissionais.                               │  ← H1 text-5xl bold
│                                                                 │
│     Web Way combina CMS, editor visual e SEO técnico            │
│     em uma plataforma simples de instalar e fácil de escalar.   │  ← subtítulo text-xl
│                                                                 │
│         [Começar gratuitamente]   [Ver demonstração]            │
│                                                                 │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │         [Screenshot do painel admin]                  │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Especificações:**
- Background: gradiente sutil primary-50 → white
- H1: text-5xl (desktop), text-3xl (mobile), font-bold
- Subtítulo: text-xl text-secondary, max-w-2xl centralizado
- CTAs: lado a lado em desktop, empilhados em mobile
- Screenshot: sombra xl, border-radius lg, placeholder com screenshot real

---

## 3. Social Proof

```
┌─────────────────────────────────────────────────────────────────┐
│         500+           98%          < 0.1s          Open        │
│       sites criados   satisfação    TTFB médio      Source      │
└─────────────────────────────────────────────────────────────────┘
```

4 métricas em linha, separadas por divisores verticais.
Fundo: neutral-50, padding 48px.

---

## 4. Benefícios

Grid de 3 cards:

```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  [⚡ Ícone]   │  │  [🔍 Ícone]   │  │  [🛡 Ícone]   │
│               │  │               │  │               │
│  Performance  │  │  SEO Técnico  │  │  Segurança    │
│               │  │               │  │               │
│  Sites rápidos│  │  Pronto para  │  │  Sem plugins  │
│  com SSR/SSG  │  │  indexar no   │  │  desnecessári │
│  e otimização │  │  Google desde │  │  os. Código   │
│  automática   │  │  o primeiro   │  │  limpo e      │
│               │  │  dia          │  │  auditável    │
└───────────────┘  └───────────────┘  └───────────────┘
```

Segunda linha:
```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  [🚀 Ícone]  │  │  [🏠 Ícone]   │  │  [🎨 Ícone]   │
│               │  │               │  │               │
│  Instalação   │  │  Hospedagem   │  │  Editor       │
│  Simples      │  │  Flexível     │  │  Visual       │
│               │  │               │  │               │
│  npm install  │  │  VPS, Docker, │  │  Blocos drag- │
│  e funciona   │  │  PaaS ou      │  │  and-drop sem │
│               │  │  servidor      │  │  código        │
│               │  │  próprio      │  │               │
└───────────────┘  └───────────────┘  └───────────────┘
```

---

## 5. Preview do Painel

Seção com screenshot animado ou interativo do painel.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tudo que você precisa em uma só plataforma                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Screenshot grande do editor de blocos]                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Dashboard] [Editor] [SEO] [Mídia]  ← tabs para alternar      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Para Agências

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Feito para agências e freelancers                             │
│                                                                 │
│   ┌──────────────────────────────────┐                         │
│   │ ✅ Gerencie múltiplos sites      │                         │
│   │ ✅ Entregue sites para clientes  │                         │
│   │ ✅ Editor que clientes entendem  │                         │
│   │ ✅ Sem hospedagem obrigatória    │                         │
│   │ ✅ Código aberto e auditável     │                         │
│   └──────────────────────────────────┘                         │
│                                                                 │
│   [Começar como agência]                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. SEO Técnico

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   SEO técnico forte desde o primeiro dia                        │
│                                                                 │
│   ┌─────────────────────────┐  ┌────────────────────────────┐  │
│   │  [Preview Google]       │  │ • Renderização server-side │  │
│   │  site.com › sobre       │  │ • Sitemap automático       │  │
│   │  Título SEO             │  │ • robots.txt dinâmico      │  │
│   │  Descrição da página... │  │ • Open Graph configurável  │  │
│   └─────────────────────────┘  │ • JSON-LD estruturado      │  │
│                                 │ • Core Web Vitals otimizad │  │
│                                 └────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Hospedagem Flexível

```
┌─────────────────────────────────────────────────────────────────┐
│   Hospede onde quiser                                           │
│                                                                 │
│   [Docker]  [VPS]  [Railway]  [Render]  [Fly.io]  [Node]       │
│                                                                 │
│   Instale em qualquer servidor com Node.js e PostgreSQL.        │
│   Sem lock-in. Sem taxas de hospedagem obrigatória.             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Comparação

Tabela comparativa conceitual (sem citar concorrentes por nome diretamente):

```
┌─────────────────────┬──────────┬──────────────────┐
│ Característica      │ Web Way  │ CMS Tradicionais  │
├─────────────────────┼──────────┼──────────────────┤
│ Performance         │ ✅ Alta  │ ⚠ Média          │
│ SEO técnico         │ ✅ Nativo│ ❌ Plugin         │
│ Segurança           │ ✅ Alta  │ ⚠ Depende plugin │
│ Instalação          │ ✅ Simples│ ⚠ Complexa      │
│ Hospedagem flexível │ ✅ Sim   │ ⚠ Limitada       │
│ Editor moderno      │ ✅ Blocos│ ⚠ Legado         │
│ Código limpo        │ ✅ Sim   │ ❌ Legado         │
└─────────────────────┴──────────┴──────────────────┘
```

---

## 10. Roadmap Resumido

Timeline visual com as 5 fases descritas no ROADMAP.md.

---

## 11. CTA Final

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│     Pronto para criar seu primeiro site?                        │
│                                                                 │
│     [Criar conta gratuita]   [Ver documentação]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Background: gradiente primary-600 → primary-800. Texto branco.

---

## 12. Footer

```
┌─────────────────────────────────────────────────────────────────┐
│  [Web Way]              Produto  Docs  GitHub                   │
│                                                                 │
│  © 2026 Web Way. Open source sob licença MIT.                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## SEO da Landing Page

- Title: `Web Way — CMS Moderno para Sites Profissionais`
- Description: `Crie, edite e publique sites profissionais com CMS moderno, editor por blocos e SEO técnico. Instale em qualquer servidor com Node.js.`
- OG Image: Screenshot do painel 1200x630px
- JSON-LD: WebSite, Organization
- Sitemap: incluída
- Robots: index, follow
