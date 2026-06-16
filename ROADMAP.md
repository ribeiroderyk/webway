# Roadmap — Web Way

> Evolução planejada da plataforma Web Way.

---

## Fase 1 — MVP ✅ (Atual)

**Objetivo:** Base funcional com fluxo completo de criação e publicação de sites.

- [x] Autenticação (cadastro, login, sessões)
- [x] Workspaces
- [x] Criação e gestão de sites
- [x] Editor visual por blocos (Hero, Texto, Imagem, Features, CTA, FAQ, Depoimentos, Contato)
- [x] Páginas com status draft/published
- [x] Blog com editor rich text (Tiptap)
- [x] Biblioteca de mídia com upload local
- [x] SEO por página e post (title, description, OG, canonical, robots)
- [x] Sitemap XML automático por site
- [x] robots.txt dinâmico
- [x] JSON-LD (WebPage, BlogPosting, FAQPage)
- [x] Auditoria SEO com score e checklist
- [x] Templates de página
- [x] Renderização pública SSR/ISR
- [x] Instalação com Docker
- [x] Healthcheck `/api/health`

---

## Fase 2 — Publicação Avançada

**Objetivo:** Dar mais controle sobre como e quando o conteúdo é publicado.

- [ ] Domínios personalizados (apontar `cliente.com` para o site)
- [ ] SSL automático via Let's Encrypt
- [ ] Exportação estática (HTML puro sem servidor)
- [ ] Preview privado com link compartilhável
- [ ] Versionamento de páginas (histórico de alterações)
- [ ] Rollback para versão anterior
- [ ] Agendamento de publicação (publicar em data/hora específica)
- [ ] Integração com Google Analytics e Google Search Console
- [ ] Redirects (301/302) configuráveis via painel
- [ ] Cache granular por página

---

## Fase 3 — Agências e Equipes

**Objetivo:** Tornar a Web Way uma plataforma viável para agências com múltiplos clientes.

- [ ] Multiusuário no workspace (convidar membros)
- [ ] Papéis completos: Owner, Admin, Editor, Viewer, Client
- [ ] Modo cliente: painel simplificado para o cliente final
- [ ] White-label (remover marca Web Way do painel do cliente)
- [ ] Templates privados por workspace
- [ ] Relatórios de atividade da equipe
- [ ] Transferência de sites entre workspaces
- [ ] Múltiplos workspaces por usuário

---

## Fase 4 — Ecossistema

**Objetivo:** Criar um ecossistema de extensibilidade e integrações.

- [ ] Marketplace de templates
- [ ] Marketplace de blocos
- [ ] SDK para criar blocos externos
- [ ] Plugins seguros (sandbox isolado)
- [ ] API pública REST com autenticação por token
- [ ] Webhooks para eventos (publicação, upload, etc.)
- [ ] Integrações nativas: Mailchimp, HubSpot, Intercom, WhatsApp
- [ ] Formulários com destino configurável (email, webhook, planilha)
- [ ] Proteção por senha em páginas individuais

---

## Fase 5 — Migração e Escala

**Objetivo:** Facilitar migração de outros CMSs e suportar uso em larga escala.

- [ ] Importador WordPress (WXR)
- [ ] Importador de mídia em massa
- [ ] Redirects automáticos pós-migração
- [ ] Auditoria SEO pós-migração
- [ ] Multi-idioma (i18n) por site
- [ ] E-commerce leve (produtos, pedidos simples, integração Stripe/PagSeguro)
- [ ] Busca interna no site público
- [ ] CDN integrado (Cloudflare)
- [ ] Alta disponibilidade (multi-instância, session distribuído)
- [ ] Auditoria de segurança e conformidade LGPD

---

## Contribuindo

Encontrou um bug? Tem uma sugestão?

1. Abra uma Issue no GitHub
2. Descreva o problema ou ideia com detalhes
3. Aguarde o feedback antes de abrir um PR

Para contribuições de código, veja `CONTRIBUTING.md` (em breve).
