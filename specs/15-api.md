# API e Server Actions — Especificação

> Todos os endpoints e server actions do Web Way. Toda ação valida permissão e dados com Zod.

---

## Padrão de Resposta

### Sucesso

```json
{ "data": {...}, "message": "Operação realizada com sucesso" }
```

### Erro

```json
{ "error": "Mensagem de erro legível", "code": "ERROR_CODE", "details": {} }
```

### Codes de Erro Comuns

| Code                  | Status | Descrição                          |
|-----------------------|--------|------------------------------------|
| UNAUTHORIZED          | 401    | Sem sessão válida                  |
| FORBIDDEN             | 403    | Sem permissão para este recurso    |
| NOT_FOUND             | 404    | Recurso não encontrado             |
| VALIDATION_ERROR      | 422    | Dados inválidos (detalhes no body) |
| SLUG_ALREADY_EXISTS   | 409    | Slug duplicado                     |
| UPLOAD_TOO_LARGE      | 413    | Arquivo muito grande               |
| INTERNAL_ERROR        | 500    | Erro interno do servidor           |

---

## Auth Endpoints

### POST /api/auth/signup
Cria usuário e workspace.

**Body:**
```ts
{ name: string; email: string; password: string }
```

**Response:** `{ data: { user, workspace, session } }`

**Processo:**
1. Validar body com Zod
2. Verificar e-mail único
3. Hash bcrypt da senha (cost 12)
4. Criar User
5. Criar Workspace (`${name} Workspace`)
6. Criar WorkspaceMember (role: OWNER)
7. Criar Session
8. Set cookie httpOnly

---

### POST /api/auth/login
Autentica usuário.

**Body:** `{ email: string; password: string }`

**Response:** `{ data: { user, workspace } }`

**Segurança:**
- Rate limit: 5 req/15min por IP
- bcrypt.compare para verificar senha
- Nunca revelar se e-mail existe ou não
- Session com expiração de 30 dias

---

### POST /api/auth/logout
Invalida sessão atual.

**Response:** `{ message: "Logout realizado" }`

---

### GET /api/auth/session
Retorna dados da sessão atual.

**Response:** `{ data: { user, workspace } }` ou `{ data: null }`

---

## Sites API

### GET /api/sites
Lista sites do workspace autenticado.

**Query:** `?search=&status=&page=1&perPage=12`

**Response:** `{ data: { sites: Site[], total, page, totalPages } }`

---

### POST /api/sites
Cria novo site.

**Body:**
```ts
{
  name: string;        // 2-100 chars
  slug: string;        // único no workspace, a-z0-9-
  description?: string;
  language: string;    // pt-BR, en, es
  primaryColor?: string;
}
```

---

### GET /api/sites/[siteId]
Retorna detalhes do site.

**Permissão:** workspace member

---

### PATCH /api/sites/[siteId]
Atualiza configurações do site.

**Body:** Partial<Site> (apenas campos editáveis)

---

### DELETE /api/sites/[siteId]
Exclui site e todo conteúdo.

**Body:** `{ confirmName: string }` — deve corresponder ao site.name

---

## Pages API

### GET /api/sites/[siteId]/pages
Lista páginas do site.

**Query:** `?search=&status=&page=1`

---

### POST /api/sites/[siteId]/pages
Cria nova página.

**Body:**
```ts
{
  title: string;
  slug: string;
  templateId?: string;  // blocos do template
}
```

**Processo:**
1. Validar body
2. Verificar unicidade de slug no site
3. Se templateId: copiar blocos do template
4. Criar Page com `status: DRAFT`

---

### GET /api/sites/[siteId]/pages/[pageId]
Retorna página com blocos.

---

### PATCH /api/sites/[siteId]/pages/[pageId]
Atualiza metadados da página.

**Body:** Partial<Page> (title, slug, seo*, robots*, og*, showInNav)

---

### PUT /api/sites/[siteId]/pages/[pageId]/blocks
Salva blocos da página (editor).

**Body:** `{ blocks: Block[] }`

**Validação:** JSON Schema dos blocos + limite de 50 blocos por página.

---

### POST /api/sites/[siteId]/pages/[pageId]/publish
Publica a página.

**Response:** `{ data: { page } }`

---

### POST /api/sites/[siteId]/pages/[pageId]/unpublish
Despublica a página.

---

### DELETE /api/sites/[siteId]/pages/[pageId]
Exclui página.

---

## Posts API

### GET /api/sites/[siteId]/posts
Lista posts.

---

### POST /api/sites/[siteId]/posts
Cria post.

**Body:**
```ts
{
  title: string;
  slug: string;
  excerpt?: string;
}
```

---

### GET /api/sites/[siteId]/posts/[postId]
Retorna post.

---

### PATCH /api/sites/[siteId]/posts/[postId]
Atualiza post.

**Body:** Partial<Post>

---

### PUT /api/sites/[siteId]/posts/[postId]/content
Salva conteúdo do editor rich text.

**Body:** `{ content: TiptapJson }`

---

### POST /api/sites/[siteId]/posts/[postId]/publish
Publica post.

---

### DELETE /api/sites/[siteId]/posts/[postId]
Exclui post.

---

## Media API

### GET /api/sites/[siteId]/media
Lista arquivos de mídia.

**Query:** `?search=&type=image|document&page=1`

---

### POST /api/sites/[siteId]/media/upload
Upload de arquivo.

**Content-Type:** `multipart/form-data`
**Field:** `file` (max 10MB)

**Processo:**
1. Validar tipo e tamanho
2. Sanitizar nome do arquivo
3. Salvar em `/public/uploads/[siteId]/[timestamp]-[filename]`
4. Extrair dimensões se imagem
5. Criar registro Media

**Response:** `{ data: { media: Media } }`

---

### PATCH /api/sites/[siteId]/media/[mediaId]
Atualiza alt text e caption.

**Body:** `{ altText?: string; caption?: string }`

---

### DELETE /api/sites/[siteId]/media/[mediaId]
Exclui arquivo e registro.

---

## SEO API

### GET /api/sites/[siteId]/seo/audit
Executa auditoria SEO de todas as páginas e posts.

**Response:** `{ data: { pages: AuditResult[], posts: AuditResult[], averageScore } }`

---

### POST /api/sites/[siteId]/seo/audit/[entityId]
Executa auditoria de uma página ou post específico.

**Query:** `?type=page|post`

---

## Healthcheck

### GET /api/health

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-06-15T18:00:00Z",
  "services": {
    "database": "ok",
    "storage": "ok"
  }
}
```

Status 200 se tudo ok, 503 se algum serviço falhou.

---

## Validação com Zod

Todos os schemas de validação em `/src/lib/validators.ts`:

```ts
export const createSiteSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(2).max(60),
  description: z.string().max(500).optional(),
  language: z.string().default("pt-BR"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export const createPageSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-/]+$/).min(1).max(100),
  templateId: z.string().cuid().optional(),
});

export const seoSchema = z.object({
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(200).optional(),
  ogImageUrl: z.string().url().optional(),
});
```

---

## Middleware de Permissão

```ts
// /src/lib/permissions.ts

export async function requireAuth(req: Request): Promise<User> {
  const session = await getSession(req);
  if (!session) throw new ApiError("UNAUTHORIZED", 401);
  return session.user;
}

export async function requireSiteAccess(
  user: User,
  siteId: string
): Promise<Site> {
  const site = await getSiteWithWorkspace(siteId);
  if (!site) throw new ApiError("NOT_FOUND", 404);
  
  const isMember = await isWorkspaceMember(user.id, site.workspaceId);
  if (!isMember) throw new ApiError("FORBIDDEN", 403);
  
  return site;
}
```
