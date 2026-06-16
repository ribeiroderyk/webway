# Sistema de Blocos — Web Way

> Documentação completa do sistema de blocos do editor visual.

---

## Conceito

O editor de páginas da Web Way é baseado em **blocos**. Cada página é uma lista ordenada de blocos. Cada bloco tem:

- `id`: identificador único (gerado no cliente com `nanoid`)
- `type`: tipo do bloco (`hero`, `text`, `image`, etc.)
- `props`: propriedades específicas do tipo de bloco

Os blocos são persistidos como `JSON` no campo `blocks` da tabela `pages`.

---

## Estrutura de um Bloco

```ts
interface Block {
  id: string;     // "block_abc123" — gerado com nanoid
  type: string;   // tipo do bloco (chave no registry)
  props: Record<string, unknown>;  // propriedades tipadas por bloco
}
```

---

## Block Registry

O registry é o ponto central que mapeia tipos de blocos para suas implementações.

```ts
// /src/features/editor/blocks/registry.ts

export interface BlockDefinition<T = Record<string, unknown>> {
  type: string;
  label: string;
  description: string;
  category: "structure" | "content" | "media" | "interaction";
  icon: string;                    // nome do ícone Lucide
  component: React.ComponentType<T>;        // renderização pública
  editorComponent: React.ComponentType<{    // formulário do editor
    props: T;
    onChange: (props: T) => void;
  }>;
  schema: ZodSchema<T>;            // validação Zod
  defaults: T;                     // valores padrão
}

export const blockRegistry: Record<string, BlockDefinition> = {
  hero: heroDefinition,
  text: textDefinition,
  image: imageDefinition,
  "feature-grid": featureGridDefinition,
  cta: ctaDefinition,
  contact: contactDefinition,
  faq: faqDefinition,
  testimonials: testimonialsDefinition,
};
```

---

## Anatomia de um Bloco

Cada bloco tem 4 arquivos:

```
/src/features/editor/blocks/hero/
  HeroBlock.tsx         ← Renderização pública (SSR)
  HeroBlockEditor.tsx   ← Formulário de edição (Properties Panel)
  schema.ts             ← Tipos TypeScript + Schema Zod
  defaults.ts           ← Valores padrão
  index.ts              ← Exporta a BlockDefinition
```

### Exemplo: HeroBlock

```ts
// schema.ts
import { z } from "zod";

export const heroSchema = z.object({
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(400).default(""),
  eyebrow: z.string().max(100).default(""),
  buttonText: z.string().max(50).default(""),
  buttonUrl: z.string().max(500).default("#"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  alignment: z.enum(["left", "center"]).default("center"),
  bgColor: z.string().default("transparent"),
});

export type HeroProps = z.infer<typeof heroSchema>;
```

```ts
// defaults.ts
import type { HeroProps } from "./schema";

export const heroDefaults: HeroProps = {
  headline: "Título principal aqui",
  subheadline: "Subtítulo ou descrição da seção",
  eyebrow: "",
  buttonText: "Começar agora",
  buttonUrl: "#",
  imageUrl: "",
  alignment: "center",
  bgColor: "transparent",
};
```

```tsx
// HeroBlock.tsx — componente de renderização pública
import type { HeroProps } from "./schema";

export function HeroBlock({ headline, subheadline, eyebrow, buttonText, buttonUrl, imageUrl, alignment }: HeroProps) {
  return (
    <section className={`py-20 px-6 ${alignment === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">
          {eyebrow}
        </p>
      )}
      <h1 className="text-5xl font-bold text-neutral-900 mb-6">
        {headline}
      </h1>
      {subheadline && (
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          {subheadline}
        </p>
      )}
      {buttonText && (
        <a
          href={buttonUrl}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          {buttonText}
        </a>
      )}
    </section>
  );
}
```

```tsx
// HeroBlockEditor.tsx — formulário no Properties Panel
import { Input, Textarea, RadioGroup, Select } from "@/components/ui";
import type { HeroProps } from "./schema";

interface Props {
  props: HeroProps;
  onChange: (props: HeroProps) => void;
}

export function HeroBlockEditor({ props, onChange }: Props) {
  const update = (key: keyof HeroProps) => (value: unknown) =>
    onChange({ ...props, [key]: value });

  return (
    <div className="space-y-4">
      <Input
        label="Eyebrow"
        value={props.eyebrow}
        onChange={update("eyebrow")}
        placeholder="Ex: Novidade"
      />
      <Input
        label="Headline *"
        value={props.headline}
        onChange={update("headline")}
        required
      />
      <Textarea
        label="Subheadline"
        value={props.subheadline}
        onChange={update("subheadline")}
        rows={3}
      />
      <Input
        label="Texto do botão"
        value={props.buttonText}
        onChange={update("buttonText")}
      />
      <Input
        label="URL do botão"
        value={props.buttonUrl}
        onChange={update("buttonUrl")}
        type="url"
      />
      <RadioGroup
        label="Alinhamento"
        value={props.alignment}
        onChange={update("alignment")}
        options={[
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
        ]}
      />
    </div>
  );
}
```

---

## Criando um Novo Bloco

### Passo 1: Criar a pasta

```
/src/features/editor/blocks/meu-bloco/
```

### Passo 2: Definir o schema

```ts
// schema.ts
export const meuBlocoSchema = z.object({
  title: z.string().min(1),
  // ... outros campos
});

export type MeuBlocoProps = z.infer<typeof meuBlocoSchema>;
```

### Passo 3: Definir os defaults

```ts
// defaults.ts
export const meuBlocoDefaults: MeuBlocoProps = {
  title: "Título padrão",
};
```

### Passo 4: Criar o componente público

```tsx
// MeuBloco.tsx
export function MeuBloco({ title }: MeuBlocoProps) {
  return <section><h2>{title}</h2></section>;
}
```

### Passo 5: Criar o editor

```tsx
// MeuBlocoEditor.tsx
export function MeuBlocoEditor({ props, onChange }: EditorProps<MeuBlocoProps>) {
  return (
    <Input
      label="Título"
      value={props.title}
      onChange={(v) => onChange({ ...props, title: v })}
    />
  );
}
```

### Passo 6: Criar o index

```ts
// index.ts
import type { BlockDefinition } from "../registry";
import { MeuBloco } from "./MeuBloco";
import { MeuBlocoEditor } from "./MeuBlocoEditor";
import { meuBlocoSchema, type MeuBlocoProps } from "./schema";
import { meuBlocoDefaults } from "./defaults";

export const meuBlocoDefinition: BlockDefinition<MeuBlocoProps> = {
  type: "meu-bloco",
  label: "Meu Bloco",
  description: "Descrição do que este bloco faz",
  category: "content",
  icon: "star",
  component: MeuBloco,
  editorComponent: MeuBlocoEditor,
  schema: meuBlocoSchema,
  defaults: meuBlocoDefaults,
};
```

### Passo 7: Registrar no registry

```ts
// registry.ts
import { meuBlocoDefinition } from "./meu-bloco";

export const blockRegistry = {
  // ... blocos existentes
  "meu-bloco": meuBlocoDefinition,
};
```

Pronto. O bloco estará disponível automaticamente no editor e na renderização pública.

---

## Validação dos Blocos

Antes de salvar, os blocos são validados:

```ts
// /src/server/services/pageService.ts
export async function saveBlocks(siteId: string, pageId: string, blocks: Block[]) {
  // Validar cada bloco contra seu schema
  const validatedBlocks = blocks.map((block) => {
    const definition = blockRegistry[block.type];
    if (!definition) throw new Error(`Tipo de bloco desconhecido: ${block.type}`);
    
    const result = definition.schema.safeParse(block.props);
    if (!result.success) throw new ValidationError(result.error);
    
    return { id: block.id, type: block.type, props: result.data };
  });
  
  // Limite de blocos
  if (validatedBlocks.length > 50) {
    throw new Error("Máximo de 50 blocos por página");
  }
  
  return prisma.page.update({
    where: { id: pageId, siteId },
    data: { blocks: validatedBlocks, updatedAt: new Date() },
  });
}
```

---

## Blocos e SEO

Blocos contribuem para o SEO da página:

| Bloco         | Contribuição SEO                              |
|---------------|-----------------------------------------------|
| HeroBlock     | H1 da página (headline), imagem hero         |
| TextBlock     | H2 + conteúdo de texto                       |
| ImageBlock    | Imagem com alt text                          |
| FAQBlock      | JSON-LD FAQPage automático                   |
| FeatureGrid   | Conteúdo estruturado H3                      |

O `seoService` analisa os blocos da página para calcular o score SEO:
- Verifica se há H1 (HeroBlock)
- Conta palavras no conteúdo
- Verifica imagens com alt text
- Detecta bloco FAQ para JSON-LD
