# Conta e Workspace — Especificação

---

## Tela: Configurações da Conta

**Rota:** `/app/account`  
**Layout:** Admin com layout container  
**Acesso:** Autenticado

### Tabs

```
[Perfil] [Segurança] [Notificações]
─────────
```

### Tab: Perfil

```
┌────────────────────────────────────────────────────────────┐
│ Minha Conta / Perfil                                       │
│                                                            │
│  Foto de perfil                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Avatar 80px]   [Alterar foto]   [Remover]          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Nome completo *                                           │
│  [João Silva                                          ]    │
│                                                            │
│  E-mail *                                                  │
│  [joao@exemplo.com                                    ]    │
│  Alteração de e-mail requer confirmação por e-mail         │
│                                                            │
│                                      [Salvar alterações]   │
└────────────────────────────────────────────────────────────┘
```

### Tab: Segurança

```
┌────────────────────────────────────────────────────────────┐
│  Alterar senha                                             │
│                                                            │
│  Senha atual *                                             │
│  [                                       [👁]          ]  │
│                                                            │
│  Nova senha *                                              │
│  [                                       [👁]          ]  │
│  Mínimo 8 caracteres                                       │
│                                                            │
│  Confirmar nova senha *                                    │
│  [                                       [👁]          ]  │
│                                                            │
│                                       [Alterar senha]      │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│                                                            │
│  Sessões ativas                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Chrome — Windows 11         Agora (sessão atual) ●   │  │
│  │ Safari — iPhone             há 2 dias           [✕]  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                  [Encerrar outras sessões] │
└────────────────────────────────────────────────────────────┘
```

---

## Tela: Workspace

**Rota:** `/app/workspace`  
**Layout:** Admin com layout container  
**Acesso:** Autenticado + owner do workspace

```
┌────────────────────────────────────────────────────────────┐
│ Workspace                                                  │
│                                                            │
│  Informações do Workspace                                  │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  Nome do workspace *                                       │
│  [João Silva Workspace                                ]    │
│                                                            │
│  Slug *                                                    │
│  [joao-silva                                          ]    │
│                                                            │
│                                      [Salvar alterações]   │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  Equipe (em breve)                                         │
│  ─────────────────────────────────────────────────────     │
│  [Info] O gerenciamento de equipe estará disponível        │
│  em breve. Você poderá convidar membros com diferentes     │
│  níveis de acesso.                                         │
│                                                            │
│  Papéis planejados:                                        │
│  • Owner — controle total                                  │
│  • Admin — gerencia sites e membros                        │
│  • Editor — cria e edita conteúdo                          │
│  • Viewer — visualiza conteúdo                             │
│  • Client — acesso limitado definido pelo admin            │
│                                                            │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  Plano                                                     │
│  ─────────────────────────────────────────────────────     │
│  Plano atual: Open Source (sem limitações no MVP)          │
└────────────────────────────────────────────────────────────┘
```

---

## User Menu (Topbar)

```
┌────────────────────────────────────┐
│ [Avatar] João Silva                │
│ joao@exemplo.com                   │
│ ────────────────────────────────   │
│ 👤 Minha conta                    │
│ ⚙️ Workspace                      │
│ ────────────────────────────────   │
│ 🚪 Sair                           │
└────────────────────────────────────┘
```

Exibido ao clicar no Avatar/nome no canto superior direito da topbar.

---

## Notificações (Topbar)

**Badge:** número de notificações não lidas (máximo exibido: "9+")

```
┌────────────────────────────────────────────┐
│ 🔔 Notificações                      [✓]  │  ← marcar todas como lidas
│ ──────────────────────────────────────     │
│ ● Página "Home" publicada           2h    │
│ ● Novo arquivo enviado: foto.jpg    1d    │
│ ○ Site criado com sucesso           3d    │  ← já lida
│ ──────────────────────────────────────     │
│           [Ver todas as notificações]      │
└────────────────────────────────────────────┘
```

No MVP: notificações geradas por ações do próprio usuário (feedback visual de ações importantes).

---

## Logout

POST `/api/auth/logout` → invalida sessão → redirect para `/login`.
Confirmação não necessária (baixo impacto).
