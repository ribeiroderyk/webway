# Web Way — Design System

> Sistema de design oficial da plataforma Web Way. Toda interface deve seguir este documento para garantir consistência visual e experiência coerente em todas as telas.

---

## Estrutura do Design System

```
/design-system
  index.md              ← Este arquivo (visão geral)
  tokens.md             ← Tokens de design (cores, tipografia, espaçamento)
  layout.md             ← Sistema de layout e grid
  components/
    buttons.md
    forms.md
    cards.md
    navigation.md
    feedback.md
    data-display.md
    editor.md
    seo.md
```

---

## Princípios de Design

### 1. Clareza
Cada elemento tem um propósito claro. Evitar decoração sem função. Hierarquia visual evidente.

### 2. Consistência
Mesmos padrões em todas as telas. Componentes reutilizáveis. Tokens sempre respeitados.

### 3. Eficiência
Ações comuns acessíveis rapidamente. Formulários sem etapas desnecessárias. Feedback imediato.

### 4. Confiança
Visual profissional e estável. Sem surpresas no comportamento. Mensagens claras.

### 5. Acessibilidade
Contraste mínimo WCAG AA. Navegação por teclado. ARIA labels quando necessário.

---

## Identidade Visual

**Web Way** tem estética de produto SaaS profissional moderno — inspirada conceitualmente no Able Pro Admin, mas com identidade própria.

Sensação desejada:
- Tecnológico mas acessível
- Denso porém limpo
- Confiável e estável
- Fácil de navegar

---

## Referências de Componentes

Todos os componentes são baseados em **Radix UI** com estilização via **Tailwind CSS**. A biblioteca de componentes segue os padrões do **shadcn/ui**, adaptados com tokens da Web Way.

Cada componente possui:
- Variantes (size, variant, state)
- Estados (default, hover, focus, disabled, loading)
- Composição clara
- Suporte a tema claro e escuro

---

## Versionamento

| Versão | Data       | Descrição            |
|--------|------------|----------------------|
| 0.1.0  | 2026-06-15 | Criação inicial      |
