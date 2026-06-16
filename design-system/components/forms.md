# Forms — Web Way Design System

---

## Input

### Anatomia

```
[Label]
┌──────────────────────────────┐
│ [Prefix]  Valor digitado  [Suffix] │
└──────────────────────────────┘
[Helper text / Error message]
```

### Variantes de Estado

| Estado   | Borda              | Background        |
|----------|--------------------|-------------------|
| Default  | border-default     | bg-sunken         |
| Hover    | border-strong      | bg-sunken         |
| Focus    | border-focus       | bg-surface        |
| Error    | error-500          | error-50          |
| Success  | success-500        | success-50        |
| Disabled | border-default     | bg-neutral-100    |

### Tamanhos

| Size | Height | Padding     | Font     |
|------|--------|-------------|----------|
| sm   | 32px   | 0 8px       | text-sm  |
| md   | 40px   | 0 12px      | text-sm  |
| lg   | 48px   | 0 16px      | text-base|

### Props

```tsx
<Input
  label="Título da Página"
  placeholder="Ex: Sobre nós"
  helper="Aparecerá como título principal"
  error="Campo obrigatório"
  prefix={<Search />}
  suffix={<X />}
  size="md"
  disabled={false}
  required
/>
```

---

## Textarea

Mesmas regras do Input. Altura mínima: 96px. Resize: vertical apenas.

```tsx
<Textarea
  label="Descrição SEO"
  placeholder="Descreva o conteúdo da página..."
  helper="Recomendado: 120-160 caracteres"
  maxLength={160}
  showCount
  rows={4}
/>
```

---

## Select

Dropdown nativo ou via Radix UI Select para customização.

```tsx
<Select
  label="Status"
  placeholder="Selecione..."
  options={[
    { value: "draft", label: "Rascunho" },
    { value: "published", label: "Publicado" },
    { value: "archived", label: "Arquivado" },
  ]}
/>
```

---

## Checkbox

```
☑ Indexar no Google (robotsIndex)
☑ Seguir links (robotsFollow)
```

```tsx
<Checkbox
  label="Indexar no Google"
  description="Permite que o Google rastreie esta página"
  checked={robotsIndex}
  onChange={setRobotsIndex}
/>
```

---

## Switch (Toggle)

Para configurações on/off visualmente claras.

```
○────  OFF
   ───● ON (primary-500)
```

```tsx
<Switch
  label="Site publicado"
  description="Torna o site acessível publicamente"
  checked={isPublished}
  onChange={setIsPublished}
/>
```

---

## Radio Group

```
● Opção 1
○ Opção 2
○ Opção 3
```

```tsx
<RadioGroup
  label="Alinhamento"
  value={alignment}
  onChange={setAlignment}
  options={[
    { value: "left", label: "Esquerda" },
    { value: "center", label: "Centro" },
    { value: "right", label: "Direita" },
  ]}
/>
```

---

## Form Layout

### Seção de Formulário

```tsx
<FormSection
  title="Informações SEO"
  description="Configurações de como esta página aparecerá nos buscadores"
>
  <Input label="Título SEO" />
  <Textarea label="Descrição SEO" />
</FormSection>
```

### Separador de Seções

Linha horizontal `border-t border-default` com `py-6` entre seções.

### Grid de Campos

```tsx
// Dois campos lado a lado
<div className="grid grid-cols-2 gap-4">
  <Input label="Nome" />
  <Input label="Sobrenome" />
</div>
```

---

## Validação

- Erros exibidos abaixo do campo em `text-error-600 text-xs`
- Ícone de erro `AlertCircle` à direita do input no estado de erro
- Mensagem clara e acionável: "Campo obrigatório", "Slug já existe", "Máximo 160 caracteres"
- Validação com Zod no servidor; feedback ao client via server action response

---

## Formulário de Criação (Modal ou Página)

```
[Modal / Página]
  [Title]
  [Description]
  ─────────────
  [Field 1]
  [Field 2]
  [Field 3]
  ─────────────
  [Cancel]  [Confirm]
```

Botão Confirm: primary, loading state enquanto submete.
Botão Cancel: ghost/secondary.

---

## Field Required

Label de campos obrigatórios: asterisco vermelho após o label.

```
Título *
Slug *
```
