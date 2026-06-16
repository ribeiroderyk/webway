# Autenticação — Especificação de Telas

---

## Tela: Cadastro

**Rota:** `/signup`  
**Layout:** Centralizado, sem sidebar, fundo neutral-50  
**Acesso:** Público (redireciona para /app/dashboard se já autenticado)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Logo Web Way]                               │
│                                                                 │
│           ┌─────────────────────────────────┐                  │
│           │                                 │                  │
│           │  Crie sua conta                 │                  │
│           │  Comece gratuitamente            │                  │
│           │                                 │                  │
│           │  Nome completo *                │                  │
│           │  [                           ]  │                  │
│           │                                 │                  │
│           │  E-mail *                       │                  │
│           │  [                           ]  │                  │
│           │                                 │                  │
│           │  Senha *                        │                  │
│           │  [                        [👁]] │                  │
│           │  Mínimo 8 caracteres            │                  │
│           │                                 │                  │
│           │  [    Criar conta gratuita    ] │  ← primary btn   │
│           │                                 │                  │
│           │  Já tem conta? Fazer login →    │                  │
│           │                                 │                  │
│           └─────────────────────────────────┘                  │
│                                                                 │
│           Ao criar conta você concorda com os                   │
│           Termos de Uso e Política de Privacidade               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Campos

| Campo          | Tipo     | Validação                                          |
|----------------|----------|----------------------------------------------------|
| name           | text     | Obrigatório, 2-100 chars                           |
| email          | email    | Obrigatório, formato válido, único no banco        |
| password       | password | Obrigatório, mínimo 8 chars, hash bcrypt no save   |

### Comportamento

1. Submit desabilita o botão e exibe spinner
2. Sucesso: cria user + workspace padrão → redireciona para `/app/dashboard`
3. E-mail já cadastrado: exibe inline error no campo email
4. Erro genérico: Toast error
5. Após criação, workspace com nome "{nome} Workspace" é criado automaticamente

### Estados

- Default: formulário vazio
- Loading: botão com spinner, campos disabled
- Error: campos com borda vermelha e mensagem abaixo
- Success: redirecionamento automático

---

## Tela: Login

**Rota:** `/login`  
**Layout:** Centralizado, sem sidebar, fundo neutral-50  
**Acesso:** Público (redireciona se autenticado)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [Logo Web Way]                               │
│                                                                 │
│           ┌─────────────────────────────────┐                  │
│           │                                 │                  │
│           │  Bem-vindo de volta             │                  │
│           │  Entre na sua conta             │                  │
│           │                                 │                  │
│           │  E-mail *                       │                  │
│           │  [                           ]  │                  │
│           │                                 │                  │
│           │  Senha *                        │                  │
│           │  [                        [👁]] │                  │
│           │              Esqueceu a senha?  │  ← link direita  │
│           │                                 │                  │
│           │  [         Entrar             ] │  ← primary btn   │
│           │                                 │                  │
│           │  Não tem conta? Criar conta →   │                  │
│           │                                 │                  │
│           └─────────────────────────────────┘                  │
│                                                                 │
│           Demo: demo@webway.local / webway123                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Campos

| Campo    | Tipo     | Validação                    |
|----------|----------|------------------------------|
| email    | email    | Obrigatório, formato válido  |
| password | password | Obrigatório                  |

### Comportamento

1. Submit valida credenciais no servidor
2. Sucesso: cria sessão → redireciona para `/app/dashboard`
3. Credenciais inválidas: Alert no topo do form "E-mail ou senha incorretos"
4. Conta inexistente: mesma mensagem (não revelar se e-mail existe)
5. Redirect param: `/login?redirect=/app/sites/123` → redireciona para URL após login
6. Rate limiting: bloquear após 5 tentativas em 15 minutos

### Segurança

- Senha nunca logada ou exposta
- Session token com httpOnly cookie
- CSRF protection em todas as ações de auth
- Mensagem genérica para evitar user enumeration

---

## Tela: Recuperação de Senha

**Rota:** `/forgot-password`  
**Layout:** Centralizado, sem sidebar

### Layout — Passo 1: Solicitar reset

```
┌─────────────────────────────────────────────────────────────────┐
│                    [Logo Web Way]                               │
│                                                                 │
│           ┌─────────────────────────────────┐                  │
│           │  Recuperar senha                │                  │
│           │                                 │                  │
│           │  Digite seu e-mail para receber │                  │
│           │  um link de redefinição.        │                  │
│           │                                 │                  │
│           │  E-mail *                       │                  │
│           │  [                           ]  │                  │
│           │                                 │                  │
│           │  [    Enviar link de reset    ] │                  │
│           │                                 │                  │
│           │  ← Voltar para o login          │                  │
│           └─────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

### Layout — Passo 2: Confirmação

```
│           │  ✅ E-mail enviado!             │
│           │                                 │
│           │  Se este e-mail está cadastrado,│
│           │  você receberá o link em breve. │
│           │                                 │
│           │  ← Voltar para o login          │
```

(Sempre exibir mensagem de sucesso, independente do e-mail existir — segurança)

### Rota: `/reset-password?token=...`

Form com campo nova senha + confirmar senha. Token validado no servidor.

---

## Middleware de Proteção de Rotas

Todas as rotas `/app/**` requerem sessão válida.
Sem sessão: redirecionar para `/login?redirect={URL_atual}`.

```ts
// middleware.ts
export const config = {
  matcher: ["/app/:path*"],
};

export function middleware(request: NextRequest) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL(`/login?redirect=${request.url}`, request.url));
  }
}
```
