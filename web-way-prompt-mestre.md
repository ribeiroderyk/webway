# Prompt Mestre — Web Way

> Documento para orientar uma IA de desenvolvimento na criação do projeto **Web Way**, um CMS moderno concorrente do WordPress, com design system inspirado no Able Pro Admin, instalação simples, hospedagem flexível e SEO técnico forte.

---

## 0. Como usar este prompt

Copie todo este documento e cole em uma ferramenta de desenvolvimento assistida por IA, como Cursor, Claude Code, Replit Agent, Lovable, Bolt, v0, Windsurf ou equivalente.

A IA deve construir um projeto real, funcional e evolutivo chamado **Web Way**. Não entregar apenas telas mockadas. O sistema precisa ter arquitetura, banco, autenticação, painel, editor visual, renderização pública e documentação de instalação.

---

## 1. Papel da IA

Você é um arquiteto sênior de software, engenheiro full-stack, product designer, especialista em CMS, especialista em SEO técnico e especialista em sistemas SaaS.

Sua missão é criar a primeira versão funcional da plataforma **Web Way**, um CMS moderno concorrente do WordPress, focado em agências, freelancers, criadores, profissionais de marketing e pequenos negócios.

Você deve tomar decisões técnicas sólidas, criar uma arquitetura limpa e entregar uma base pronta para evoluir.

---

## 2. Visão do produto

A **Web Way** é uma plataforma para criar, editar, publicar e gerenciar sites profissionais de forma simples, rápida, segura e otimizada para mecanismos de busca.

A Web Way deve unir:

- a flexibilidade de um CMS;
- a facilidade de um construtor visual;
- a performance de sites modernos;
- a segurança de uma plataforma gerenciada;
- a liberdade de hospedagem em qualquer ambiente;
- a compatibilidade com Google e SEO técnico desde o primeiro dia.

A Web Way não deve ser uma cópia do WordPress. Ela deve ser uma alternativa moderna, mais limpa, mais rápida, mais segura e mais fácil de manter.

---

## 3. Nome, marca e posicionamento

Nome do produto: **Web Way**

Slogan principal:

> Crie sites rápidos, bonitos e fáceis de gerenciar.

Slogans alternativos:

- Seu site, do seu jeito.
- Publique sem complicação.
- Menos manutenção. Mais criação.
- Uma nova rota para criar na web.
- Construa, edite e publique em minutos.

Posicionamento:

> Web Way é um CMS moderno para agências, freelancers e pequenos negócios que querem criar sites profissionais, rápidos, seguros e prontos para ranquear no Google, sem depender de manutenção pesada, plugins inseguros ou hospedagem específica.

Sensação desejada:

- mais simples que WordPress;
- mais profissional que construtores básicos;
- mais flexível que plataformas fechadas;
- mais seguro que ecossistemas dependentes de muitos plugins;
- mais fácil de instalar que sistemas complexos;
- mais amigável para agências e clientes finais.

---

## 4. Público-alvo

O MVP deve atender principalmente:

1. agências pequenas e médias;
2. freelancers que criam sites para clientes;
3. criadores de conteúdo;
4. profissionais de marketing;
5. pequenos negócios;
6. empresas que precisam de landing pages, blogs e sites institucionais.

Problemas que a Web Way resolve:

- manutenção constante de sites;
- lentidão;
- excesso de plugins;
- dificuldade para ranquear no Google;
- painéis confusos;
- risco de que clientes quebrem o layout;
- dificuldade de migrar, hospedar e escalar;
- dependência de uma única hospedagem.

---

## 5. Inspiração visual — Able Pro Admin

O design system da Web Way deve ser inspirado no painel **Able Pro Admin**: `https://ableproadmin.com/dashboard/index.html`.

Use a inspiração visual de forma conceitual, sem copiar código proprietário, assets, identidade visual, textos ou componentes específicos. A Web Way deve ter identidade própria.

Características a absorver da inspiração:

- layout administrativo moderno;
- sidebar lateral organizada;
- topbar com busca, notificações, ações rápidas e perfil;
- cards com métricas;
- dashboards com estatísticas;
- menus agrupados por categoria;
- alternância de tema claro/escuro;
- componentes densos, porém limpos;
- tabelas administrativas bem organizadas;
- badges de status;
- cards com sombras suaves;
- ícones consistentes;
- páginas internas com cabeçalho, breadcrumb e área de conteúdo;
- configurações de layout;
- sensação SaaS profissional.

A Web Way deve adaptar essa inspiração para o contexto de CMS.

---

## 6. Direção visual da Web Way

Estilo visual:

- moderno;
- limpo;
- profissional;
- tecnológico;
- espaçoso;
- confiável;
- responsivo;
- acessível.

Paleta sugerida:

- fundo principal: cinza muito claro;
- superfícies: branco;
- texto principal: cinza escuro;
- texto secundário: cinza médio;
- cor primária: azul, índigo ou violeta;
- cor secundária: ciano ou verde suave;
- estados positivos: verde;
- alertas: amarelo/laranja;
- erros: vermelho;
- modo escuro com contraste bem calibrado.

Layout do painel:

- sidebar fixa em desktop;
- sidebar recolhível;
- menu superior com busca global;
- área de usuário no canto superior;
- notificações;
- botão rápido “Criar site”;
- botão rápido “Nova página”;
- breadcrumbs;
- cards informativos;
- tabelas com filtros;
- empty states amigáveis;
- modais limpos;
- drawers laterais para edição rápida.

Componentes mínimos:

- Button;
- Input;
- Textarea;
- Select;
- Checkbox;
- Switch;
- Radio;
- Card;
- Badge;
- Avatar;
- Dropdown;
- Modal;
- Drawer;
- Tabs;
- Sidebar;
- Topbar;
- Breadcrumb;
- PageHeader;
- EmptyState;
- DataTable;
- Toast;
- Tooltip;
- Alert;
- StatCard;
- ProgressCard;
- FileCard;
- SEOPreview;
- PublishStatusBadge.

---

## 7. Tema claro, tema escuro e personalização

Implementar suporte estrutural para:

- tema claro;
- tema escuro;
- tema automático baseado no sistema;
- sidebar compacta;
- sidebar expandida;
- largura full;
- largura container;
- cor primária configurável futuramente por workspace.

No MVP, a troca de tema pode ser funcional via estado local ou persistida por usuário.

---

## 8. Stack técnica recomendada

Use uma stack moderna, popular e fácil de hospedar.

Stack preferencial:

- **Framework:** Next.js com App Router;
- **Linguagem:** TypeScript;
- **UI:** React;
- **CSS:** Tailwind CSS;
- **Componentes:** shadcn/ui ou componentes próprios baseados em Radix UI;
- **Banco:** PostgreSQL;
- **ORM:** Prisma;
- **Autenticação:** Auth.js/NextAuth ou autenticação própria segura;
- **Validação:** Zod;
- **Upload:** storage local no MVP, com adaptação para S3, Cloudflare R2, MinIO ou DigitalOcean Spaces;
- **Editor:** editor visual próprio baseado em blocos React;
- **Renderização:** SSR/SSG/ISR quando possível;
- **SEO:** metadata server-side, sitemap, robots, canonical, Open Graph e JSON-LD;
- **Deploy:** compatível com Node.js, Docker, VPS, PaaS e hospedagens que suportem Node.

Evite dependência obrigatória de Vercel. O sistema deve poder rodar em qualquer hospedagem com Node.js e PostgreSQL.

---

## 9. Requisito crítico: hospedagem flexível

A Web Way deve ser fácil de instalar e hospedar.

O projeto deve suportar:

1. hospedagem em VPS comum;
2. hospedagem com Docker;
3. serviços PaaS como Railway, Render, Fly.io, DigitalOcean App Platform ou equivalentes;
4. hospedagem em ambiente próprio com Node.js;
5. PostgreSQL local ou gerenciado;
6. storage local no MVP;
7. storage externo opcional.

Não criar dependência obrigatória de plataforma específica.

---

## 10. Instalação simples

Criar documentação clara para instalação.

Entregar:

- `README.md`;
- `.env.example`;
- `docker-compose.yml`;
- `Dockerfile`;
- script de seed;
- comandos de setup;
- instruções para desenvolvimento local;
- instruções para produção;
- instruções para backup;
- instruções para configurar domínio;
- instruções para configurar storage externo futuramente.

Fluxo desejado para instalação local:

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Fluxo desejado com Docker:

```bash
cp .env.example .env
docker compose up -d
```

Adicionar comando de healthcheck:

```bash
GET /api/health
```

A rota deve retornar status do app, banco e versão.

---

## 11. Compatibilidade com Google e SEO técnico

A Web Way deve ser construída com SEO técnico forte desde o MVP.

Objetivo:

> Todo site publicado na Web Way deve ser fácil de rastrear, indexar, entender e ranquear no Google.

A implementação deve seguir boas práticas oficiais do Google Search Central, incluindo SEO básico, rastreamento, indexação, JavaScript SEO, dados estruturados e Core Web Vitals.

Requisitos obrigatórios:

### 11.1 Renderização amigável ao Google

- páginas públicas devem renderizar conteúdo principal no servidor sempre que possível;
- evitar depender exclusivamente de client-side rendering para conteúdo indexável;
- usar SSR, SSG ou ISR para páginas públicas;
- garantir que título, descrição, headings, links e conteúdo estejam no HTML inicial;
- evitar que Googlebot precise executar interações para encontrar conteúdo essencial.

### 11.2 Metadata por página

Cada página e post deve permitir configurar:

- title;
- meta description;
- slug;
- canonical URL;
- robots meta: index/noindex, follow/nofollow;
- imagem Open Graph;
- título Open Graph;
- descrição Open Graph;
- Twitter/X card;
- idioma;
- autor;
- data de publicação;
- data de atualização.

### 11.3 URLs limpas

Gerar URLs amigáveis:

```txt
/s/[siteSlug]
/s/[siteSlug]/[pageSlug]
/s/[siteSlug]/blog
/s/[siteSlug]/blog/[postSlug]
```

Futuramente, suportar domínio próprio:

```txt
https://cliente.com/
https://cliente.com/sobre
https://cliente.com/blog/artigo
```

Regras:

- slugs legíveis;
- evitar parâmetros desnecessários;
- permitir redirects;
- evitar conteúdo duplicado;
- criar canonical corretamente.

### 11.4 Sitemap automático

Criar sitemap XML automático por site.

Rotas sugeridas:

```txt
/s/[siteSlug]/sitemap.xml
/sitemap.xml
```

O sitemap deve incluir:

- páginas publicadas;
- posts publicados;
- data de atualização;
- canonical;
- prioridade opcional;
- frequência opcional.

### 11.5 Robots.txt

Criar robots.txt dinâmico.

Rota sugerida:

```txt
/robots.txt
```

Deve permitir:

- liberar sites publicados;
- bloquear páginas de admin;
- bloquear previews privados;
- apontar para sitemap;
- respeitar noindex em sites rascunho.

### 11.6 Dados estruturados JSON-LD

Adicionar suporte a JSON-LD para:

- Organization;
- WebSite;
- WebPage;
- BlogPosting;
- Article;
- BreadcrumbList;
- LocalBusiness futuramente;
- FAQPage futuramente;
- Product futuramente, caso haja e-commerce.

Os dados estruturados devem refletir apenas conteúdo visível ao usuário.

### 11.7 Performance e Core Web Vitals

O sistema deve ser otimizado para:

- LCP baixo;
- INP baixo;
- CLS baixo;
- HTML leve;
- imagens otimizadas;
- lazy loading para imagens não críticas;
- preload apenas quando necessário;
- fontes otimizadas;
- CSS enxuto;
- JavaScript mínimo nas páginas públicas;
- cache HTTP;
- CDN-ready;
- compressão gzip/brotli quando disponível.

### 11.8 Imagens SEO-friendly

Gerenciamento de mídia deve permitir:

- alt text;
- title opcional;
- legenda;
- compressão;
- dimensões;
- formatos modernos quando possível;
- lazy loading;
- imagem destacada de posts;
- imagem Open Graph.

### 11.9 Preview SEO

Criar componente `SEOPreview` no admin.

Ele deve mostrar:

- simulação de resultado Google;
- title;
- URL;
- description;
- avisos de tamanho;
- status index/noindex;
- canonical;
- preview de compartilhamento social.

### 11.10 Auditoria SEO básica

Criar checklist automático por página:

- title preenchido;
- description preenchida;
- H1 único;
- slug amigável;
- imagem com alt;
- canonical presente;
- página publicada;
- tamanho mínimo de conteúdo;
- links internos;
- Open Graph configurado;
- schema válido quando aplicável.

---

## 12. Áreas principais da aplicação

A aplicação deve ter três grandes áreas:

1. site institucional da Web Way;
2. painel administrativo;
3. sites públicos gerados pela plataforma.

---

## 13. Landing page pública da Web Way

Criar uma landing page para vender a plataforma.

Rota:

```txt
/
```

Seções obrigatórias:

1. hero;
2. benefícios;
3. demonstração visual do painel;
4. seção para agências;
5. seção de SEO;
6. seção de hospedagem flexível;
7. comparação conceitual com sistemas antigos;
8. recursos principais;
9. roadmap resumido;
10. CTA final.

Copy sugerida:

> A nova forma de criar, editar e publicar sites profissionais.

> Web Way combina CMS, editor visual e SEO técnico em uma plataforma simples de instalar e fácil de escalar.

CTAs:

- Começar agora;
- Ver demonstração;
- Criar meu primeiro site.

---

## 14. Painel administrativo

Rotas sugeridas:

```txt
/app/dashboard
/app/sites
/app/sites/new
/app/sites/[siteId]
/app/sites/[siteId]/pages
/app/sites/[siteId]/pages/new
/app/sites/[siteId]/pages/[pageId]/editor
/app/sites/[siteId]/posts
/app/sites/[siteId]/posts/new
/app/sites/[siteId]/posts/[postId]
/app/sites/[siteId]/media
/app/sites/[siteId]/seo
/app/sites/[siteId]/settings
/app/templates
/app/account
/app/workspace
```

O painel deve ter:

- sidebar;
- topbar;
- busca global;
- menu de usuário;
- notificações;
- cards de métricas;
- tabelas;
- filtros;
- badges de status;
- empty states;
- navegação clara.

Menu sugerido:

- Dashboard;
- Sites;
- Páginas;
- Blog;
- Mídia;
- SEO;
- Templates;
- Integrações;
- Configurações;
- Conta.

---

## 15. Dashboard

O dashboard deve mostrar:

- total de sites;
- páginas publicadas;
- posts publicados;
- arquivos de mídia;
- sites em rascunho;
- atalhos rápidos;
- últimos sites editados;
- checklist de configuração;
- card de saúde SEO;
- card de performance futura;
- atividade recente.

Inspirar-se nos cards e métricas do Able Pro Admin, mas com conteúdo próprio da Web Way.

---

## 16. Sites públicos

Rotas públicas do MVP:

```txt
/s/[siteSlug]
/s/[siteSlug]/[pageSlug]
/s/[siteSlug]/blog
/s/[siteSlug]/blog/[postSlug]
/s/[siteSlug]/sitemap.xml
```

Cada site publicado deve:

- renderizar páginas publicadas;
- retornar 404 para conteúdo inexistente;
- respeitar status draft/published;
- gerar metadata dinâmica;
- gerar JSON-LD quando aplicável;
- ter canonical;
- ser responsivo;
- carregar rápido.

---

## 17. Modelagem de dados

Criar modelos no Prisma.

### User

Campos:

- id;
- name;
- email;
- passwordHash ou provider auth;
- role;
- createdAt;
- updatedAt.

### Workspace

Campos:

- id;
- name;
- slug;
- ownerId;
- createdAt;
- updatedAt.

### WorkspaceMember

Campos:

- id;
- workspaceId;
- userId;
- role: owner | admin | editor | viewer | client;
- createdAt;
- updatedAt.

### Site

Campos:

- id;
- workspaceId;
- name;
- slug;
- description;
- logoUrl;
- faviconUrl;
- primaryColor;
- language;
- timezone;
- status: draft | published | archived;
- customDomain opcional;
- googleSiteVerification opcional;
- createdAt;
- updatedAt.

### Page

Campos:

- id;
- siteId;
- title;
- slug;
- seoTitle;
- seoDescription;
- canonicalUrl;
- robotsIndex boolean;
- robotsFollow boolean;
- ogTitle;
- ogDescription;
- ogImageUrl;
- status: draft | published;
- blocks: JSON;
- createdAt;
- updatedAt;
- publishedAt.

### Post

Campos:

- id;
- siteId;
- authorId;
- title;
- slug;
- excerpt;
- content: JSON;
- coverImageUrl;
- seoTitle;
- seoDescription;
- canonicalUrl;
- robotsIndex boolean;
- robotsFollow boolean;
- ogTitle;
- ogDescription;
- ogImageUrl;
- status: draft | published;
- createdAt;
- updatedAt;
- publishedAt.

### Media

Campos:

- id;
- siteId;
- fileName;
- fileUrl;
- mimeType;
- size;
- width;
- height;
- altText;
- caption;
- createdAt.

### Template

Campos:

- id;
- name;
- description;
- category;
- thumbnailUrl;
- blocks: JSON;
- isPublic;
- createdAt;
- updatedAt.

### Redirect

Campos:

- id;
- siteId;
- fromPath;
- toPath;
- statusCode: 301 | 302;
- createdAt;
- updatedAt.

### SeoAudit

Campos:

- id;
- pageId opcional;
- postId opcional;
- score;
- issues: JSON;
- createdAt;
- updatedAt.

---

## 18. Editor visual por blocos

Criar editor funcional.

Rota:

```txt
/app/sites/[siteId]/pages/[pageId]/editor
```

O editor deve ter:

- sidebar com blocos disponíveis;
- área central de preview;
- painel lateral de propriedades;
- botão salvar;
- botão publicar;
- botão visualizar página;
- botão duplicar bloco;
- botão remover bloco;
- botão mover para cima/baixo;
- estado de alterações não salvas;
- autosave opcional;
- preview responsivo desktop/tablet/mobile.

Blocos iniciais:

### HeroBlock

Campos:

- headline;
- subheadline;
- buttonText;
- buttonUrl;
- imageUrl;
- alignment: left | center;
- eyebrow opcional.

### TextBlock

Campos:

- title;
- content;
- alignment.

### ImageBlock

Campos:

- imageUrl;
- altText;
- caption;
- aspectRatio.

### FeatureGridBlock

Campos:

- title;
- description;
- features: array com title, description e icon.

### CTASectionBlock

Campos:

- title;
- description;
- buttonText;
- buttonUrl.

### ContactBlock

Campos:

- title;
- description;
- email;
- phone;
- address.

### FAQBlock

Campos:

- title;
- items: array com question e answer;
- gerar JSON-LD FAQPage futuramente quando adequado.

### TestimonialsBlock

Campos:

- title;
- testimonials: array com name, role, content, avatarUrl.

Estrutura JSON dos blocos:

```json
[
  {
    "id": "block_123",
    "type": "hero",
    "props": {
      "headline": "Crie seu site com a Web Way",
      "subheadline": "Uma forma moderna de publicar páginas profissionais.",
      "buttonText": "Começar agora",
      "buttonUrl": "/signup",
      "alignment": "center"
    }
  }
]
```

---

## 19. Arquitetura dos blocos

Criar uma arquitetura extensível:

```txt
/src/features/editor/blocks
  /hero
    HeroBlock.tsx
    HeroBlockEditor.tsx
    schema.ts
    defaults.ts
  /text
  /image
  /feature-grid
  /cta
  /contact
  /faq
  /testimonials
  registry.ts
```

Cada bloco deve ter:

- tipo TypeScript;
- schema Zod;
- componente de renderização;
- componente de edição;
- valores padrão;
- metadados para aparecer na biblioteca de blocos.

Criar um `BlockRenderer` que recebe a lista de blocos e renderiza o componente correto.

Exemplo:

```tsx
<BlockRenderer blocks={page.blocks} />
```

---

## 20. Funcionalidades do MVP

### 20.1 Autenticação

Implementar:

- cadastro;
- login;
- logout;
- sessão;
- proteção de rotas;
- usuário dono de workspace;
- conta demo opcional.

### 20.2 Workspace

Implementar:

- workspace padrão ao criar conta;
- listagem básica;
- papel owner;
- estrutura preparada para equipe futura.

### 20.3 Sites

Implementar:

- criar site;
- listar sites;
- editar site;
- arquivar site;
- publicar site;
- visualizar site público.

### 20.4 Páginas

Implementar:

- criar página;
- editar título e slug;
- editar SEO;
- abrir editor;
- salvar blocos;
- publicar/despublicar;
- excluir página.

### 20.5 Blog

Implementar:

- criar post;
- editar título, slug, resumo e conteúdo;
- imagem destacada;
- SEO;
- publicar/despublicar;
- listar posts.

### 20.6 Mídia

Implementar:

- upload local no MVP;
- listagem de arquivos;
- copiar URL;
- editar alt text;
- excluir arquivo;
- preparar adapter para S3/R2/MinIO.

### 20.7 SEO

Implementar:

- SEO por página;
- SEO por post;
- preview Google;
- sitemap;
- robots;
- canonical;
- Open Graph;
- JSON-LD básico;
- checklist de auditoria.

---

## 21. Permissões e segurança

No MVP, implementar pelo menos:

- usuário autenticado;
- workspace owner;
- acesso apenas aos próprios sites;
- validação no servidor;
- checagem de permissão em todas as ações;
- proteção contra acesso cruzado entre workspaces.

Preparar para papéis futuros:

- owner;
- admin;
- editor;
- viewer;
- client.

Boas práticas:

- validar dados com Zod;
- proteger rotas privadas;
- não expor segredos no frontend;
- usar variáveis de ambiente;
- sanitizar HTML quando existir conteúdo rich text;
- evitar renderização insegura;
- limitar upload por tipo e tamanho;
- usar headers de segurança;
- registrar ações importantes futuramente.

---

## 22. Estrutura de pastas sugerida

```txt
/src
  /app
    /(public)
    /(auth)
    /app
    /s
    /api
  /components
    /ui
    /layout
    /dashboard
    /seo
  /features
    /auth
    /workspaces
    /sites
    /pages
    /posts
    /media
    /editor
    /templates
    /seo
  /lib
    prisma.ts
    auth.ts
    env.ts
    validators.ts
    permissions.ts
    seo.ts
    storage.ts
    slug.ts
  /server
    /services
      workspaceService.ts
      siteService.ts
      pageService.ts
      postService.ts
      mediaService.ts
      seoService.ts
    /repositories
  /styles
  /types
/prisma
  schema.prisma
  seed.ts
/public
/docs
```

---

## 23. Services e regras de negócio

Criar services para centralizar regras:

- `workspaceService`;
- `siteService`;
- `pageService`;
- `postService`;
- `mediaService`;
- `seoService`;
- `permissionService`.

Evitar lógica de negócio espalhada em componentes React.

---

## 24. APIs internas

Criar endpoints ou server actions para:

- criar site;
- atualizar site;
- listar sites;
- criar página;
- atualizar página;
- salvar blocos;
- publicar página;
- criar post;
- atualizar post;
- publicar post;
- upload de mídia;
- gerar auditoria SEO;
- healthcheck.

Todas as ações devem validar permissão e dados.

---

## 25. Seed inicial

Criar seed com:

- usuário demo;
- workspace demo;
- site demo chamado “Studio Web Way”;
- página inicial publicada;
- página “Sobre”;
- página “Contato”;
- dois posts de blog;
- mídia demonstrativa;
- blocos variados.

Credenciais demo no README:

```txt
E-mail: demo@webway.local
Senha: webway123
```

A senha deve ser armazenada com hash, nunca em texto puro no banco.

---

## 26. Experiência principal do usuário

O fluxo principal deve funcionar:

1. usuário cria conta ou usa demo;
2. entra no dashboard;
3. cria workspace automaticamente;
4. cria um site;
5. cria uma página;
6. abre editor visual;
7. adiciona blocos;
8. edita conteúdo;
9. salva;
10. configura SEO;
11. publica;
12. visualiza página pública;
13. acessa sitemap e robots.

Esse fluxo é prioridade máxima.

---

## 27. Páginas obrigatórias do admin

Criar telas com qualidade visual inspirada em painel SaaS moderno.

### Dashboard

- métricas;
- cards;
- checklist;
- atividade recente.

### Sites

- tabela/lista de sites;
- status;
- botões de ação;
- busca;
- empty state.

### Novo site

- formulário simples;
- nome;
- slug;
- descrição;
- idioma;
- cor principal.

### Páginas

- tabela de páginas;
- status;
- SEO status;
- última atualização;
- ações rápidas.

### Editor

- layout visual;
- blocos;
- preview;
- propriedades.

### Blog

- listagem;
- edição;
- publicação.

### Mídia

- grid de arquivos;
- upload;
- alt text.

### SEO

- auditoria;
- sitemap;
- robots;
- verificação Google;
- preview.

### Configurações

- dados do site;
- domínio futuro;
- idioma;
- favicon;
- logo;
- publicação.

---

## 28. Qualidade, testes e DX

Adicionar:

- ESLint;
- Prettier;
- TypeScript strict;
- validação de env;
- scripts úteis no `package.json`;
- tratamento de erros;
- loading states;
- empty states;
- mensagens de sucesso;
- mensagens de erro;
- componentes reutilizáveis.

Scripts sugeridos:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "db:migrate": "prisma migrate dev",
  "db:deploy": "prisma migrate deploy",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio"
}
```

---

## 29. Arquivos obrigatórios

Entregar no projeto:

- `README.md`;
- `ROADMAP.md`;
- `.env.example`;
- `Dockerfile`;
- `docker-compose.yml`;
- `prisma/schema.prisma`;
- `prisma/seed.ts`;
- documentação de instalação;
- documentação de deploy;
- documentação de SEO;
- documentação da arquitetura dos blocos.

---

## 30. Conteúdo do README.md

O README deve conter:

1. apresentação da Web Way;
2. stack usada;
3. pré-requisitos;
4. instalação local;
5. instalação com Docker;
6. configuração de `.env`;
7. comandos principais;
8. usuário demo;
9. estrutura de pastas;
10. como criar blocos;
11. como configurar SEO;
12. deploy em VPS;
13. deploy em PaaS;
14. troubleshooting.

---

## 31. Conteúdo do ROADMAP.md

Criar roadmap:

### Fase 1 — MVP

- autenticação;
- workspaces;
- sites;
- páginas;
- editor por blocos;
- blog;
- mídia;
- SEO básico;
- sitemap;
- robots;
- JSON-LD básico;
- Docker.

### Fase 2 — Publicação avançada

- domínios próprios;
- SSL automático;
- exportação estática;
- preview privado;
- versionamento de páginas;
- histórico de alterações;
- rollback;
- analytics.

### Fase 3 — Agências

- multiusuário;
- permissões completas;
- clientes;
- white-label;
- templates por agência;
- cobrança recorrente;
- relatórios.

### Fase 4 — Ecossistema

- marketplace de templates;
- marketplace de blocos;
- plugins seguros;
- integrações;
- API pública;
- SDK.

### Fase 5 — Migração e escala

- importador WordPress;
- importador de mídia;
- redirects automáticos;
- auditoria SEO pós-migração;
- e-commerce leve;
- multi-idioma.

---

## 32. Critérios de aceitação

O projeto será considerado bem-sucedido se:

- inicia sem erros;
- instala localmente com poucos comandos;
- roda com Docker;
- conecta ao PostgreSQL;
- executa migrations;
- executa seed;
- permite login demo;
- exibe dashboard;
- permite criar site;
- permite criar página;
- permite editar blocos;
- permite salvar blocos no banco;
- permite publicar página;
- renderiza página pública;
- gera metadata dinâmica;
- gera sitemap;
- gera robots.txt;
- gera canonical;
- exibe preview SEO;
- impede acesso a dados de outro usuário;
- possui UI profissional inspirada no estilo Able Pro, mas com identidade própria;
- possui README claro;
- possui ROADMAP claro.

---

## 33. Restrições importantes

Não fazer:

- não criar apenas protótipo visual;
- não depender exclusivamente de localStorage;
- não deixar dados mockados como se fossem reais;
- não exigir Vercel obrigatoriamente;
- não copiar código, marca ou assets do Able Pro;
- não ignorar SEO;
- não deixar páginas públicas dependentes apenas de client-side rendering;
- não criar arquitetura confusa;
- não espalhar regra de negócio em componentes;
- não permitir acesso cruzado entre usuários.

Fazer:

- MVP funcional;
- código limpo;
- UI bonita;
- banco real;
- instalação simples;
- SEO técnico;
- renderização server-side para conteúdo público;
- arquitetura extensível;
- documentação clara.

---

## 34. Entrega final esperada

Ao concluir, apresente:

1. resumo do que foi criado;
2. instruções para rodar localmente;
3. instruções para rodar com Docker;
4. usuário demo;
5. estrutura principal do projeto;
6. rotas disponíveis;
7. funcionalidades implementadas;
8. limitações conhecidas;
9. próximos passos.

O resultado deve ser uma base real da **Web Way**, pronta para evoluir para um CMS moderno, instalável, rápido, seguro, amigável para Google e competitivo com sistemas tradicionais.

---

## 35. Instrução final para a IA executora

Construa a Web Way como um produto real.

Priorize, nesta ordem:

1. arquitetura limpa;
2. fluxo principal funcionando;
3. instalação fácil;
4. painel visual profissional;
5. editor por blocos;
6. persistência real;
7. renderização pública rápida;
8. SEO técnico forte;
9. segurança;
10. documentação.

Mantenha o código simples o suficiente para evoluir, mas organizado o suficiente para escalar.

A Web Way deve nascer como um MVP sólido, não como uma demonstração superficial.
