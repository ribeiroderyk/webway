# Guia de Instalação — Web Way

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- npm ou pnpm

---

## Instalação Local (Desenvolvimento)

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/web-way.git
cd web-way
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/webway
SESSION_SECRET=gere-uma-string-aleatoria-longa-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Criar banco de dados e rodar migrations

```bash
npx prisma migrate dev --name init
```

### 5. Popular banco com dados demo

```bash
npx prisma db seed
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

**Credenciais demo:**
- E-mail: `demo@webway.local`
- Senha: `webway123`

---

## Instalação com Docker

### Pré-requisito

Docker e Docker Compose instalados.

### 1. Clonar e configurar

```bash
git clone https://github.com/seu-usuario/web-way.git
cd web-way
cp .env.example .env
```

### 2. Subir os containers

```bash
docker compose up -d
```

Isso iniciará:
- PostgreSQL na porta 5432
- Aplicação Web Way na porta 3000
- (aguarda banco estar pronto antes de rodar migrations)

### 3. Verificar status

```bash
docker compose ps
curl http://localhost:3000/api/health
```

### 4. Ver logs

```bash
docker compose logs -f app
```

---

## Deploy em VPS

### Requisitos do servidor

- Ubuntu 22.04+ (ou Debian 12+)
- Node.js 20+ (via nvm ou nodesource)
- PostgreSQL 15+
- Nginx (como reverse proxy)
- PM2 (gerenciador de processos Node.js)

### Passo a passo

#### 1. Preparar servidor

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Instalar PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib
```

#### 2. Criar banco de dados

```bash
sudo -u postgres psql
CREATE DATABASE webway;
CREATE USER webway_user WITH ENCRYPTED PASSWORD 'senha-segura';
GRANT ALL PRIVILEGES ON DATABASE webway TO webway_user;
\q
```

#### 3. Clonar e configurar

```bash
git clone https://github.com/seu-usuario/web-way.git /opt/webway
cd /opt/webway
cp .env.example .env
# Editar .env com as configurações de produção
```

#### 4. Build e migrations

```bash
npm install --frozen-lockfile
npx prisma migrate deploy
npx prisma db seed
npm run build
```

#### 5. Iniciar com PM2

```bash
pm2 start npm --name "webway" -- start
pm2 save
pm2 startup
```

#### 6. Configurar Nginx

```nginx
server {
    listen 80;
    server_name seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Servir uploads locais diretamente
    location /uploads/ {
        alias /opt/webway/public/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 7. SSL com Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com
```

---

## Deploy em PaaS (Railway / Render / Fly.io)

### Railway

1. Conectar repositório GitHub
2. Adicionar serviço PostgreSQL
3. Configurar variáveis de ambiente
4. Deploy automático ao push

Variables necessárias no Railway:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SESSION_SECRET=...
NEXT_PUBLIC_APP_URL=https://seu-app.railway.app
NODE_ENV=production
```

Start command: `npx prisma migrate deploy && npm run start`

### Render

1. Criar Web Service conectado ao GitHub
2. Criar PostgreSQL (Render managed)
3. Environment: `NODE_ENV=production`
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npx prisma migrate deploy && npm run start`

### Fly.io

```bash
fly launch
fly postgres create --name webway-db
fly postgres attach --postgres-app webway-db
fly secrets set SESSION_SECRET=...
fly deploy
```

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build de produção
npm run start        # Servidor de produção

# Banco de dados
npm run db:migrate   # Rodar migrations (dev)
npm run db:deploy    # Rodar migrations (prod)
npm run db:seed      # Popular banco com dados demo
npm run db:studio    # Abrir Prisma Studio (visualizador do banco)
npm run db:reset     # Resetar banco (CUIDADO: apaga tudo)

# Qualidade de código
npm run lint         # ESLint
npm run typecheck    # TypeScript check

# Healthcheck
curl http://localhost:3000/api/health
```

---

## Variáveis de Ambiente Completas

Ver [`.env.example`](../.env.example) para a lista completa com descrições.

---

## Backup do Banco

```bash
# Backup
pg_dump -U webway_user -h localhost webway > backup_$(date +%Y%m%d).sql

# Restore
psql -U webway_user -h localhost webway < backup_20260615.sql
```

Para backup automático com PM2/cron:
```bash
# Crontab: backup diário às 3h
0 3 * * * pg_dump -U webway_user webway > /backups/webway_$(date +\%Y\%m\%d).sql
```
