# Deploy — Web Way

> Guia de deploy em diferentes ambientes. Consulte também [installation.md](installation.md).

---

## Docker Compose (Produção Simples)

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: webway
      POSTGRES_USER: webway
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U webway"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://webway:${POSTGRES_PASSWORD}@postgres:5432/webway
      SESSION_SECRET: ${SESSION_SECRET}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
      NODE_ENV: production
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - uploads_data:/app/public/uploads
    command: >
      sh -c "npx prisma migrate deploy && 
             node -e 'require(\"./prisma/seed\")' && 
             npm start"

volumes:
  postgres_data:
  uploads_data:
```

---

## Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Dependências
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

---

## Variáveis de Ambiente por Ambiente

### Desenvolvimento Local

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/webway
SESSION_SECRET=dev-secret-nao-usar-em-producao
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
STORAGE_PROVIDER=local
```

### Produção (VPS / Docker)

```env
DATABASE_URL=postgresql://webway:SENHA_FORTE@localhost:5432/webway
SESSION_SECRET=string-aleatoria-256-bits-aqui
NEXT_PUBLIC_APP_URL=https://seudominio.com
NODE_ENV=production
STORAGE_PROVIDER=local
POSTGRES_PASSWORD=SENHA_FORTE
```

### Produção (Railway)

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SESSION_SECRET=string-gerada-pelo-railway-ou-manual
NEXT_PUBLIC_APP_URL=${{RAILWAY_STATIC_URL}}
NODE_ENV=production
```

---

## CI/CD com GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_KEY }}
          script: |
            cd /opt/webway
            git pull origin main
            npm ci --frozen-lockfile
            npx prisma migrate deploy
            npm run build
            pm2 restart webway
```

---

## Checklist de Deploy

Antes do primeiro deploy em produção:

- [ ] Gerar `SESSION_SECRET` com 256 bits aleatórios
- [ ] Configurar `DATABASE_URL` com banco de produção
- [ ] Definir `NEXT_PUBLIC_APP_URL` com o domínio real
- [ ] Configurar `NODE_ENV=production`
- [ ] Configurar SSL/HTTPS (Certbot ou Let's Encrypt)
- [ ] Configurar Nginx como reverse proxy
- [ ] Configurar backup automático do banco
- [ ] Testar `GET /api/health` após deploy
- [ ] Verificar que `/robots.txt` está acessível
- [ ] Verificar que sitemap está sendo gerado
- [ ] Fazer login com credenciais demo e testar fluxo completo

---

## Domínio e SSL

### Com Nginx + Certbot

```bash
# Configurar Nginx (conf em /etc/nginx/sites-available/webway)
sudo nginx -t && sudo systemctl reload nginx

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática (já configurada pelo certbot)
sudo certbot renew --dry-run
```

### Com Caddy (alternativa mais simples)

```
# Caddyfile
seudominio.com {
    reverse_proxy localhost:3000
}
```

Caddy gerencia SSL automaticamente via Let's Encrypt.

---

## Monitoramento

### Healthcheck

```bash
# Cron para verificar saúde a cada 5 minutos
*/5 * * * * curl -f http://localhost:3000/api/health || pm2 restart webway
```

### Logs com PM2

```bash
pm2 logs webway --lines 100
pm2 monit
```

---

## Backup e Restore

```bash
# Backup automático diário
# /opt/scripts/backup-webway.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/webway

mkdir -p $BACKUP_DIR

# Banco de dados
pg_dump -U webway -h localhost webway | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /opt/webway/public/uploads/

# Manter apenas 30 dias
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup concluído: $DATE"
```

```bash
# Restore do banco
gunzip -c /backups/webway/db_20260615_030000.sql.gz | psql -U webway webway

# Restore dos uploads
tar -xzf /backups/webway/uploads_20260615_030000.tar.gz -C /opt/webway/
```
