# Feedback Components — Web Way Design System

---

## Toast (Notificações Temporárias)

Exibido no canto superior direito. Desaparece após 4s (com opção de dismiss).

```
┌──────────────────────────────────────┐
│ ✅ Página publicada com sucesso!     │ [×]
└──────────────────────────────────────┘
```

```tsx
toast.success("Página publicada com sucesso!")
toast.error("Erro ao salvar. Tente novamente.")
toast.warning("Título SEO muito longo.")
toast.info("Alterações salvas automaticamente.")
```

**Anatomia:**
- Ícone: 16px alinhado ao centro vertical
- Texto: text-sm, max 2 linhas
- Botão dismiss: X no canto direito
- Duração: 4000ms padrão, 8000ms para erros

---

## Alert (Banner de Alerta)

Alerta persistente em uma área da página.

```
┌─────────────────────────────────────────────────┐
│ ℹ  Este site está em modo rascunho.             │
│    Publique para torná-lo acessível.  [Publicar]│
└─────────────────────────────────────────────────┘
```

```tsx
<Alert
  variant="info"    // info | success | warning | error
  icon={<Info />}
  title="Site em rascunho"
  description="Publique para torná-lo acessível ao público."
  action={<Button size="sm">Publicar</Button>}
  dismissible
/>
```

---

## Modal / Dialog

Para confirmações, formulários simples e informações importantes.

```
┌──────────────────────────────────────────┐
│                                    [×]   │
│  Excluir página                          │
│  ─────────────────────────────────────   │
│  Tem certeza que deseja excluir          │
│  "Sobre nós"? Esta ação não pode         │
│  ser desfeita.                           │
│                                          │
│              [Cancelar]  [Excluir]       │
└──────────────────────────────────────────┘
```

**Tamanhos:**
- `sm`: max-w-sm (384px) — confirmações simples
- `md`: max-w-md (448px) — formulários pequenos
- `lg`: max-w-lg (512px) — formulários maiores
- `xl`: max-w-xl (576px) — conteúdo expandido
- `2xl`: max-w-2xl (672px) — modais complexos

**Regras:**
- Sempre fechar ao clicar fora (exceto se há alterações não salvas)
- Foco inicial no primeiro campo ou botão de ação principal
- ESC fecha o modal
- Overlay com bg-overlay e backdrop-blur-sm

---

## Drawer (Painel Lateral)

Para edição rápida sem sair da tela atual.

```
┌──────────────────────┬─────────────────────────────┐
│                      │                             │
│    CONTEÚDO          │    [×] Editar SEO           │
│    PRINCIPAL         │    ─────────────────────    │
│                      │    [Form fields...]         │
│                      │                             │
│                      │    [Cancelar] [Salvar]      │
└──────────────────────┴─────────────────────────────┘
```

- Posição: right (padrão) ou left
- Largura: 400px (sm), 560px (md), 720px (lg)
- Animação: slide-in da direita, 200ms ease

---

## Tooltip

Informação adicional em hover/focus.

```
          ┌─────────────────────┐
          │ Publicar esta página│
          └─────────────────────┘
                    ▲
              [Publicar]
```

```tsx
<Tooltip content="Publicar esta página">
  <Button>Publicar</Button>
</Tooltip>
```

- Delay: 300ms para aparecer
- Posição automática (auto flip quando fora da viewport)
- Max-width: 200px
- Font: text-xs, branco sobre neutral-900

---

## Loading States

### Skeleton

Substitui conteúdo enquanto carrega.

```tsx
<Skeleton className="h-8 w-48" />     // título
<Skeleton className="h-4 w-full" />   // linha de texto
<Skeleton className="h-32 w-full" />  // card
```

### Spinner

Para ações pontuais (dentro de botões, overlays).

```tsx
<Spinner size="sm" />  // 16px
<Spinner size="md" />  // 24px
<Spinner size="lg" />  // 32px
```

### Full Page Loading

```tsx
<PageLoading message="Carregando editor..." />
```

---

## Badge

Label de status ou categoria.

```tsx
<Badge variant="success">Publicado</Badge>
<Badge variant="warning">Rascunho</Badge>
<Badge variant="error">Arquivado</Badge>
<Badge variant="info">Preview</Badge>
<Badge variant="neutral">Pendente</Badge>
```

**Variante com ponto:**
```
● Publicado  (ponto colorido antes do texto)
```

---

## PublishStatusBadge

Badge específico de status de publicação.

```tsx
<PublishStatusBadge status="published" />  // ● Publicado (verde)
<PublishStatusBadge status="draft" />      // ○ Rascunho (cinza)
<PublishStatusBadge status="archived" />   // ⊗ Arquivado (vermelho)
```

---

## Progress

Barra de progresso para checklists e uploads.

```
███████████░░░  75%
```

```tsx
<Progress value={75} max={100} color="primary" showLabel />
```

---

## ConfirmDialog

Modal de confirmação para ações destrutivas.

```tsx
<ConfirmDialog
  title="Excluir site"
  description="Esta ação excluirá permanentemente o site e todo o seu conteúdo."
  confirmLabel="Excluir"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

Sempre requer dois cliques implicitamente (abrir modal → confirmar).
