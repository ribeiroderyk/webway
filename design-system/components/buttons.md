# Buttons — Web Way Design System

---

## Variantes

### Primary
Ação principal da tela. Usar apenas uma por contexto.

```
Background: --interactive-primary (#6366f1)
Text: white
Hover: --interactive-primary-hover (#4f46e5)
Focus: shadow-focus ring
Border: none
```

### Secondary
Ação secundária, alternativa ao primary.

```
Background: white / neutral-0
Text: text-primary
Border: 1px border-default
Hover: bg-neutral-50
```

### Ghost
Ação terciária, discreta.

```
Background: transparent
Text: text-secondary
Border: none
Hover: bg-neutral-100
```

### Danger
Ações destrutivas (deletar, arquivar).

```
Background: error-600
Text: white
Hover: error-700
```

### Success
Confirmações e publicações.

```
Background: success-600
Text: white
Hover: success-700
```

### Link
Parecer com link de texto.

```
Background: transparent
Text: text-link (primary-600)
Border: none
Hover: underline
```

---

## Tamanhos

| Tamanho | Padding         | Font    | Icon   | Uso                        |
|---------|-----------------|---------|--------|----------------------------|
| xs      | 4px 8px         | text-xs | 12px   | Ações em células de tabela |
| sm      | 6px 12px        | text-sm | 14px   | Ações secundárias          |
| md      | 8px 16px        | text-sm | 16px   | Ação padrão                |
| lg      | 10px 20px       | text-base | 18px | CTA principal              |
| xl      | 14px 28px       | text-lg | 20px   | Hero CTA                   |

---

## Estados

- **Default:** aparência normal
- **Hover:** leve escurecimento / iluminação
- **Focus:** ring de foco visível (acessibilidade)
- **Active:** slight scale 0.98
- **Disabled:** opacidade 0.5, cursor-not-allowed
- **Loading:** spinner substituindo conteúdo, disabled implícito

---

## Com Ícone

```tsx
// Ícone à esquerda (mais comum)
<Button leftIcon={<Plus />}>Nova Página</Button>

// Ícone à direita
<Button rightIcon={<ExternalLink />}>Ver Site</Button>

// Apenas ícone (usar com tooltip)
<Button iconOnly icon={<Trash />} aria-label="Excluir" />
```

---

## Grupo de Botões

```tsx
<ButtonGroup>
  <Button variant="secondary">Salvar Rascunho</Button>
  <Button variant="primary">Publicar</Button>
</ButtonGroup>
```

---

## Regras de Uso

- Nunca mais de 1 botão primary por área de ação
- Botões de ação crítica (delete) sempre com confirmação via modal
- Botões de loading nunca ficam enabled antes de terminar
- Ícone apenas (`iconOnly`) obrigatoriamente tem `aria-label`
- Em mobile, buttons de ação flutuante (FAB) quando necessário
