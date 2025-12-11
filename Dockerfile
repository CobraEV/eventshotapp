# ---------------------------------------------------------------------------
# BASE — Debian with needed tools
# ---------------------------------------------------------------------------
FROM node:20-bookworm AS base

# ---------------------------------------------------------------------------
# STAGE 1 — Install deps
# ---------------------------------------------------------------------------
FROM base AS deps

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

ENV PNPM_RUN_BUILD_SCRIPTS=true
RUN pnpm install --dangerously-allow-all-builds --frozen-lockfile


# ---------------------------------------------------------------------------
# STAGE 2 — Build
# ---------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG SMTP_HOST
ENV SMTP_HOST=$SMTP_HOST

ARG SMTP_PORT
ENV SMTP_PORT=$SMTP_PORT

ARG SMTP_SECURE
ENV SMTP_SECURE=$SMTP_SECURE

ARG SMTP_USER
ENV SMTP_USER=$SMTP_USER

ARG SMTP_PASS
ENV SMTP_PASS=$SMTP_PASS

ARG SMTP_FROM
ENV SMTP_FROM=$SMTP_FROM

RUN pnpm prisma generate
RUN pnpm build


# ---------------------------------------------------------------------------
# STAGE 3 — Runtime + entrypoint
# ---------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production

# Dateien aus dem Builder kopieren
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules ./node_modules

# dein ENTRYPOINT-Script kopieren
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
