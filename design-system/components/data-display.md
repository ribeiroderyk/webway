# Data Display — Web Way Design System

---

## DataTable

Tabela de dados com filtragem, busca e paginação.

```
┌──────────────────────────────────────────────────────────────────┐
│  [🔍 Buscar...]                     [Filtros ▼] [Exportar]      │
├────────────────────┬─────────────┬──────────┬───────────────────┤
│  Nome              │ Status      │ Atualiz. │ Ações             │
├────────────────────┼─────────────┼──────────┼───────────────────┤
│  Sobre nós         │ ● Publicado │ 10/06    │ [Editar] [•••]   │
│  Home              │ ● Publicado │ 08/06    │ [Editar] [•••]   │
│  Contato           │ ○ Rascunho  │ 05/06    │ [Editar] [•••]   │
├────────────────────┴─────────────┴──────────┴───────────────────┤
│  3 resultados          ← Anterior  [1] [2]  Próxima →           │
└──────────────────────────────────────────────────────────────────┘
```

### Props

```tsx
<DataTable
  columns={columns}
  data={data}
  searchable
  searchPlaceholder="Buscar páginas..."
  filters={[statusFilter]}
  pagination={{ page, totalPages, onPageChange }}
  emptyState={<EmptyState ... />}
  loading={isLoading}
/>
```

### Column Definition

```ts
const columns: Column<Page>[] = [
  {
    key: "title",
    label: "Nome",
    sortable: true,
    render: (row) => <span className="font-medium">{row.title}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <PublishStatusBadge status={row.status} />,
  },
  {
    key: "updatedAt",
    label: "Atualizado",
    render: (row) => <RelativeTime date={row.updatedAt} />,
  },
  {
    key: "actions",
    label: "Ações",
    align: "right",
    render: (row) => <PageActions page={row} />,
  },
];
```

### Seleção de Linhas

Checkbox na primeira coluna para seleção múltipla.
Toolbar de ação em massa aparece quando há itens selecionados:

```
[3 itens selecionados]  [Publicar] [Arquivar] [Excluir]
```

---

## List (Alternativa Visual ao DataTable)

Para listagens de cards em vez de tabela.

```
┌──────────────────────────────────────────────────────┐
│ [🔍] [Filtros]                                       │
├──────────────────────────────────────────────────────┤
│ [SiteCard]                                           │
│ [SiteCard]                                           │
│ [SiteCard]                                           │
├──────────────────────────────────────────────────────┤
│ ← 1-10 de 24 itens              Próxima →            │
└──────────────────────────────────────────────────────┘
```

Toggle entre visualização em lista e em grid:
```
[≡ Lista]  [⊞ Grid]
```

---

## MediaGrid

Grade de arquivos de mídia.

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ img  │ │ img  │ │ doc  │ │ img  │
│      │ │      │ │      │ │      │
│name  │ │name  │ │name  │ │name  │
└──────┘ └──────┘ └──────┘ └──────┘
```

- Grid: 4 colunas (desktop), 3 (tablet), 2 (mobile)
- Item selecionado: border-2 primary-500
- Hover: overlay com ações (Copiar URL, Editar, Excluir)

---

## Avatar

Foto do usuário ou iniciais.

```tsx
<Avatar
  src="/uploads/users/avatar.jpg"
  name="João Silva"
  size="md"    // xs=24, sm=32, md=40, lg=48, xl=64
/>
```

Fallback: fundo primary-100, iniciais em primary-700.

---

## AvatarGroup

```tsx
<AvatarGroup max={4}>
  {members.map(m => <Avatar key={m.id} name={m.name} src={m.avatarUrl} />)}
</AvatarGroup>
```

Exibe até `max` avatars + `+N` para os demais.

---

## Tag / Chip

```tsx
<Tag>Marketing</Tag>
<Tag onRemove={handleRemove}>Blog</Tag>
```

Usado em listagens de categorias e tags de posts.

---

## RelativeTime

```tsx
<RelativeTime date="2026-06-13T10:00:00Z" />
// Renderiza: "há 2 dias"
// Tooltip: "13/06/2026, 10:00"
```

---

## SEOScore

Indicador visual de score SEO.

```
[████████░░]  80/100  Bom
```

Cores:
- 0-49: error-500
- 50-79: warning-500
- 80-100: success-500

---

## CodeBlock

Para exibir JSON-LD, snippets e configs.

```tsx
<CodeBlock language="json">
  {JSON.stringify(jsonLd, null, 2)}
</CodeBlock>
```

Background: neutral-900, text: neutral-100.
Botão de copiar no canto superior direito.

---

## EmptyState

```tsx
<EmptyState
  icon={<FileText />}
  title="Nenhuma página encontrada"
  description="Crie sua primeira página para começar a construir seu site."
  action={
    <Button variant="primary" leftIcon={<Plus />}>
      Nova Página
    </Button>
  }
/>
```
