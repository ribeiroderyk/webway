# ── Estágio 1: Instalar dependências ─────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# ── Estágio 2: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expõe variáveis de ambiente passadas como --build-arg pelo EasyPanel
ARG DATABASE_URL
ARG SESSION_SECRET
ARG NEXT_PUBLIC_APP_URL
ARG NODE_ENV=production
ARG STORAGE_PROVIDER=local
ARG NEXT_PUBLIC_UPLOADS_URL=/uploads
ENV DATABASE_URL=$DATABASE_URL
ENV SESSION_SECRET=$SESSION_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NODE_ENV=$NODE_ENV
ENV STORAGE_PROVIDER=$STORAGE_PROVIDER
ENV NEXT_PUBLIC_UPLOADS_URL=$NEXT_PUBLIC_UPLOADS_URL

# Garante que public/ existe (Next.js não cria se não houver assets)
RUN mkdir -p /app/public

# Gera o Prisma client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# ── Estágio 3: Runner (imagem final) ─────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.bin/prisma* ./node_modules/.bin/
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Script de inicialização (roda migrations + inicia app)
COPY start.sh ./start.sh
RUN chmod +x start.sh && chown nextjs:nodejs start.sh

# Criar diretório de uploads
RUN mkdir -p public/uploads && chown nextjs:nodejs public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
