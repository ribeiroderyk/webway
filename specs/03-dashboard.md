# Dashboard — Especificação de Tela

**Rota:** `/app/dashboard`  
**Layout:** Admin padrão (sidebar + topbar + content area)  
**Acesso:** Autenticado

---

## Objetivo

Visão geral rápida do estado do workspace, atalhos para ações principais e informações relevantes para o usuário.

---

## Layout Completo

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡] Web Way          [🔍 Buscar...]              [🔔] [Avatar▼] │ ← Topbar
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                      │
│ Dashboard  │  ┌──────────────────────────────────────────────┐   │
│ ─────────  │  │ Dashboard / 15 jun 2026                      │   │ ← Breadcrumb
│ Sites      │  │                                              │   │
│ Páginas    │  │  Bom dia, João! 👋                           │   │ ← Greeting
│ Blog       │  │                                              │   │
│ Mídia      │  └──────────────────────────────────────────────┘   │
│ ─────────  │                                                      │
│ SEO        │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │ ← StatCards
│ Templates  │  │ 3 Sites  │ │ 12 Págs  │ │ 8 Posts  │ │ 24 Arq │ │
│ Integrações│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│ ─────────  │                                                      │
│ Config.    │  ┌─────────────────────────┐ ┌────────────────────┐ │
│ Conta      │  │ Últimos Sites Editados  │ │ Checklist Setup    │ │
│            │  │                         │ │                    │ │
│            │  │ [Site 1]                │ │ ✅ Criar conta     │ │
│            │  │ [Site 2]                │ │ ✅ Criar workspace │ │
│            │  │ [Site 3]                │ │ ✅ Criar primeiro  │ │
│            │  │                         │ │    site            │ │
│            │  │ [Ver todos os sites →]  │ │ ⬜ Publicar site   │ │
│            │  └─────────────────────────┘ │ ⬜ Config. SEO     │ │
│            │                              └────────────────────┘ │
│            │  ┌─────────────────────────┐ ┌────────────────────┐ │
│            │  │ Saúde SEO               │ │ Atividade Recente  │ │
│            │  │                         │ │                    │ │
│            │  │ [Gráfico/score 78%]     │ │ João publicou pág. │ │
│            │  │ 2 sites com problemas   │ │ há 2 horas         │ │
│            │  │ [Ver auditoria →]       │ │ João criou site    │ │
│            │  └─────────────────────────┘ │ há 1 dia           │ │
│            │                              └────────────────────┘ │
│            │  ┌──────────────────────────────────────────────┐   │
│            │  │ Atalhos Rápidos                              │   │
│            │  │ [+ Criar site] [+ Nova página] [📁 Mídia]   │   │
│            │  └──────────────────────────────────────────────┘   │
└────────────┴─────────────────────────────────────────────────────┘
```

---

## Componentes da Tela

### Greeting

```tsx
<DashboardGreeting
  userName={user.name}
  date={new Date()}
/>
```

Texto: "Bom dia, {nome}!" (varia com hora do dia: Bom dia / Boa tarde / Boa noite)

---

### StatCards (4 cards)

```tsx
<div className="grid grid-cols-4 gap-6">
  <StatCard
    title="Sites"
    value={stats.totalSites}
    icon={<Globe />}
    iconBg="primary"
    href="/app/sites"
    trend={stats.sitesTrend}
  />
  <StatCard
    title="Páginas publicadas"
    value={stats.publishedPages}
    icon={<FileText />}
    iconBg="success"
  />
  <StatCard
    title="Posts publicados"
    value={stats.publishedPosts}
    icon={<PenSquare />}
    iconBg="info"
  />
  <StatCard
    title="Arquivos de mídia"
    value={stats.totalMedia}
    icon={<Image />}
    iconBg="warning"
  />
</div>
```

**Dados carregados:** 1 query ao banco agrupando counts por workspace.

---

### Últimos Sites Editados

Lista dos 5 sites com mais recente `updatedAt`.

Cada item:
```
[favicon 24px] Nome do Site              ● Publicado
               /s/slug-do-site           há 2 horas
```

Link clicável abre o site (vai para `/app/sites/[id]/pages`).

---

### Checklist de Setup

Passos de onboarding. Cada passo é marcado automaticamente quando concluído:

| Passo                          | Condição de conclusão             |
|--------------------------------|-----------------------------------|
| Criar conta                    | Sempre ✅ (usuário está logado)   |
| Criar workspace                | Sempre ✅ (criado no signup)      |
| Criar primeiro site            | `totalSites > 0`                  |
| Publicar primeira página       | `publishedPages > 0`              |
| Configurar SEO de uma página   | Qualquer página com seoTitle      |
| Upload de mídia                | `totalMedia > 0`                  |

Barra de progresso no topo do card.

---

### Saúde SEO

```tsx
<SEOHealthCard
  sitesWithIssues={2}
  averageScore={78}
  onClick={() => router.push("/app/sites")}
/>
```

Card com:
- Score médio de SEO entre todos os sites (circle progress)
- Número de sites com problemas críticos
- Link para ver detalhes

---

### Atividade Recente

Lista das últimas 10 ações no workspace (futuramente de audit log):

No MVP, mostrar as páginas/posts com `updatedAt` mais recente:

```
• Home — atualizada há 2 horas
• Post "Como criar sites rápidos" — publicado há 1 dia
• Sobre nós — criada há 3 dias
```

---

### Atalhos Rápidos

```tsx
<QuickActions>
  <QuickAction
    label="Criar site"
    icon={<Plus />}
    href="/app/sites/new"
    variant="primary"
  />
  <QuickAction
    label="Nova página"
    icon={<FilePlus />}
    onClick={handleNewPage}  // abre modal de seleção de site
  />
  <QuickAction
    label="Biblioteca de Mídia"
    icon={<Image />}
    onClick={handleMedia}  // abre modal de seleção de site
  />
</QuickActions>
```

---

## Estados

### Estado Inicial (Workspace novo, sem sites)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              Bem-vindo ao Web Way! 🎉                │
│                                                      │
│  Você ainda não tem nenhum site. Crie o primeiro     │
│  site para começar a publicar conteúdo.              │
│                                                      │
│              [+ Criar meu primeiro site]             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Estado Loading

Skeleton nos StatCards e na lista de sites.

---

## Dados Necessários

Query no servidor ao carregar a rota:

```ts
const dashboardData = await getDashboardData(workspaceId);
// retorna:
// stats: { totalSites, publishedPages, publishedPosts, totalMedia, sitesTrend }
// recentSites: Site[] (5 mais recentes)
// recentActivity: Activity[] (10 mais recentes)
// seoHealth: { averageScore, sitesWithIssues }
// setupChecklist: { completed: number, total: number, steps: ChecklistStep[] }
```

---

## Responsividade

| Breakpoint | StatCards       | Cards principais     |
|------------|-----------------|----------------------|
| Mobile     | 2 colunas       | 1 coluna, empilhados |
| Tablet     | 2 colunas       | 2 colunas            |
| Desktop    | 4 colunas       | 2 colunas            |
