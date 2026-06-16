# Navigation — Web Way Design System

---

## Breadcrumb

Exibido no PageHeader, abaixo do título da seção.

```
Dashboard / Sites / Meu Site / Páginas
```

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/app/dashboard">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/app/sites">Sites</BreadcrumbItem>
  <BreadcrumbItem href="/app/sites/123">Meu Site</BreadcrumbItem>
  <BreadcrumbItem current>Páginas</BreadcrumbItem>
</Breadcrumb>
```

- Separador: `/` ou `›` em text-tertiary
- Último item: text-primary sem link
- Itens anteriores: text-link com hover underline
- Em mobile: mostra apenas o último item pai com `← Voltar`

---

## Tabs

Navegação horizontal entre sub-seções de uma página.

```
[Geral] [SEO] [Social] [Avançado]
  ─────
```

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <Tab value="general">Geral</Tab>
  <Tab value="seo">SEO</Tab>
  <Tab value="social">Social</Tab>
  <Tab value="advanced">Avançado</Tab>
</Tabs>
```

**Variante `underline` (padrão do admin):**
- Tab ativo: borda inferior primary-500, texto primary-600, font-medium
- Tab inativo: texto secondary, sem borda
- Hover: texto primary

**Variante `pill` (modais e drawers):**
- Tab ativo: bg-primary-50, texto primary-600, border-radius pill
- Tabs inativas: transparente

---

## Dropdown Menu

Menu de contexto para ações adicionais.

```
[•••] ← trigger (ícone MoreHorizontal)

┌──────────────────┐
│ ✏ Editar         │
│ 📋 Duplicar      │
│ 👁 Visualizar    │
├──────────────────┤
│ 🗑 Excluir       │  ← danger color
└──────────────────┘
```

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button iconOnly icon={<MoreHorizontal />} variant="ghost" size="sm" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem icon={<Edit />} onSelect={handleEdit}>Editar</DropdownMenuItem>
    <DropdownMenuItem icon={<Copy />} onSelect={handleDuplicate}>Duplicar</DropdownMenuItem>
    <DropdownMenuItem icon={<Eye />} onSelect={handlePreview}>Visualizar</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon={<Trash />} onSelect={handleDelete} danger>Excluir</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Sidebar Navigation Item

```tsx
<SidebarItem
  icon={<LayoutDashboard />}
  label="Dashboard"
  href="/app/dashboard"
  active={pathname === "/app/dashboard"}
/>
```

Estados: default, hover, active, disabled.

### Sidebar Section Label

```
────────────────
CONTEÚDO
```

```tsx
<SidebarSection label="Conteúdo">
  <SidebarItem ... />
</SidebarSection>
```

Label: `text-xs font-semibold uppercase text-tertiary tracking-wider`

---

## Pagination

Para tabelas com muitos registros.

```
← Anterior  [1] [2] [3] ... [10]  Próxima →
```

```tsx
<Pagination
  page={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>
```

Mostra até 7 números de página. Ellipsis quando necessário.

---

## PageHeader

Cabeçalho padronizado de cada página do admin.

```
┌──────────────────────────────────────────────────┐
│ Dashboard / Sites / Meu Site                     │  ← Breadcrumb
│                                                  │
│ Páginas                          [+ Nova Página] │  ← Title + Actions
│ Gerencie as páginas do seu site                  │  ← Description
└──────────────────────────────────────────────────┘
```

```tsx
<PageHeader
  breadcrumb={[...]}
  title="Páginas"
  description="Gerencie as páginas do seu site"
  actions={<Button leftIcon={<Plus />}>Nova Página</Button>}
/>
```

---

## Stepper

Para fluxos multi-etapa (ex: criação de site).

```
① Dados básicos  ──  ② Aparência  ──  ③ Publicação
```

```tsx
<Stepper currentStep={1} steps={["Dados básicos", "Aparência", "Publicação"]} />
```

- Passo completo: círculo primary preenchido com ✓
- Passo atual: círculo primary com número
- Passo futuro: círculo neutral com número
