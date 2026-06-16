# Configurações do Site — Especificação

Spec detalhada já incluída em [04-sites.md](04-sites.md) (seção "Tela: Configurações do Site").

Esta spec cobre configurações adicionais.

---

## Tela: Configurações Gerais do Site

**Rota:** `/app/sites/[siteId]/settings`

Remete a [04-sites.md#tela-configurações-do-site](04-sites.md).

---

## Configurações de Publicação

```
┌────────────────────────────────────────────────────────────────────┐
│ Sites / Studio / Configurações / Publicação                       │
│                                                                   │
│  Status de Publicação                                             │
│  ─────────────────────────────────────────────────               │
│                                                                   │
│  ○ Rascunho                                                       │
│    O site não está acessível ao público                           │
│                                                                   │
│  ● Publicado                                                      │
│    O site está acessível em:                                      │
│    https://webway.app/s/studio-web-way                            │
│                                                                   │
│  ○ Arquivado                                                      │
│    O site está desativado e não pode ser editado                  │
│                                                                   │
│  [Salvar status]                                                  │
│                                                                   │
│  ─────────────────────────────────────────────────               │
│                                                                   │
│  Domínio Personalizado (em breve)                                 │
│  ─────────────────────────────────────────────────               │
│  [Info badge] Esta funcionalidade está em desenvolvimento.        │
│                                                                   │
│  Quando disponível, você poderá apontar seu domínio               │
│  (cliente.com) para este site.                                    │
│                                                                   │
│  [Me avise quando disponível]                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## Zona de Perigo

```
┌────────────────────────────────────────────────────────────────────┐
│ Zona de perigo                                                    │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Arquivar site                                                │ │
│ │ Desativa o site. Pode ser reativado a qualquer momento.      │ │
│ │                                                [Arquivar]   │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Excluir site                                                 │ │
│ │ Remove permanentemente o site e todo seu conteúdo.           │ │
│ │ Esta ação não pode ser desfeita.                             │ │
│ │                                                [Excluir]    │ │
│ └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

Modal de confirmação de exclusão:
```
┌─────────────────────────────────────────────────────┐
│ Excluir "Studio Web Way"                       [×] │
│ ───────────────────────────────────────────────     │
│                                                     │
│ ⚠️ Esta ação é permanente e irreversível.           │
│                                                     │
│ Serão excluídos:                                    │
│ • 5 páginas                                         │
│ • 3 posts                                           │
│ • 8 arquivos de mídia                               │
│                                                     │
│ Digite o nome do site para confirmar:               │
│ [                                              ]    │
│                                                     │
│                    [Cancelar]  [Excluir site]        │
└─────────────────────────────────────────────────────┘
```

O botão "Excluir site" só é habilitado quando o usuário digita exatamente o nome do site.
