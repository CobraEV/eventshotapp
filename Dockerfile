# ------------------------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------------------------
FROM node:22-bookworm-slim AS deps
WORKDIR /app

# pnpm-Version bewusst gepinnt: `pnpm@latest` wird bei JEDEM Build neu
# aufgeloest, ein Versionssprung upstream aendert damit das Build-Verhalten
# ohne eine einzige Codeaenderung. Genau so hat es dieses Repo schon zweimal
# erwischt (pnpm 11 ohne onlyBuiltDependencies, pnpm 11.5 mit Node >=22.13).
# 11.24.0 ist die Version, mit der die Builds am 25.08.2026 liefen.
# Beim Anheben pruefen, ob pnpm-workspace.yaml den passenden Schluessel hat:
# allowBuilds (pnpm 11) bzw. onlyBuiltDependencies (pnpm 10).
RUN corepack enable && corepack prepare pnpm@11.24.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile


# ------------------------------------------------------------
# Stage 2: Build
# ------------------------------------------------------------
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Basic system deps only
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.24.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Prisma + Next.js Build
RUN --mount=type=secret,id=DATABASE_URL \
  --mount=type=secret,id=SMTP_HOST \
  --mount=type=secret,id=SMTP_PORT \
  --mount=type=secret,id=SMTP_SECURE \
  --mount=type=secret,id=SMTP_USER \
  --mount=type=secret,id=SMTP_PASS \
  --mount=type=secret,id=SMTP_FROM \
  export DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \
  && export SMTP_HOST="$(cat /run/secrets/SMTP_HOST)" \
  && export SMTP_PORT="$(cat /run/secrets/SMTP_PORT)" \
  && export SMTP_SECURE="$(cat /run/secrets/SMTP_SECURE)" \
  && export SMTP_USER="$(cat /run/secrets/SMTP_USER)" \
  && export SMTP_PASS="$(cat /run/secrets/SMTP_PASS)" \
  && export SMTP_FROM="$(cat /run/secrets/SMTP_FROM)" \
  && pnpm exec prisma generate \
  && pnpm run build


# ------------------------------------------------------------
# Stage 3: Runtime
# ------------------------------------------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOME=/home/nextjs

# Runtime deps only
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  curl \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN corepack enable && corepack prepare pnpm@11.24.0 --activate

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs nextjs \
  && chown -R nextjs:nodejs /home/nextjs

# App files (Next.js standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Migrations-Werkzeug im Image statt aus dem Netz.
#
# `pnpm dlx prisma@7.4.0` laedt die CLI bei JEDEM Containerstart von npm.
# Die Version ist gepinnt (siehe Vorfall unten), die Netzabhaengigkeit bleibt
# aber: ist die Registry langsam oder weg, faehrt kein Container hoch — und
# zwar genau dann, wenn man am dringendsten deployen will.
#
# prisma.config.ts liefert die Datenbank-URL (der datasource-Block im Schema
# hat keine) und importiert dafuer `prisma/config` und `dotenv`. Beide muessen
# zur Laufzeit aufloesbar sein. Eigenes Verzeichnis, damit ein npm install
# nicht mit den getracten Abhaengigkeiten des Standalone-Builds kollidiert.
WORKDIR /migrate
RUN npm install --no-save --no-audit --no-fund prisma@7.4.0 dotenv@17.3.1
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
RUN chown -R nextjs:nodejs /migrate
WORKDIR /app

USER nextjs

EXPOSE 3000

# Migration vor dem Start, fail-closed: schlaegt sie fehl, faehrt der
# Container nicht hoch und Swarm laesst die alten Tasks weiterlaufen.
#
# Die CLI liegt jetzt mit fester Version im Image (siehe /migrate oben).
# Vorgeschichte, warum die Version ueberhaupt festgenagelt gehoert:
# `pnpm dlx prisma` loeste den `latest`-Tag bei JEDEM Containerstart neu auf.
# Am 25.08.2026 zeigte der auf 8.0.0-rc.10, wo `prisma migrate` in
# `prisma migration` umbenannt wurde. Der Befehl endete mit 2, `&&` brach ab,
# server.js lief nie, und die Container gingen in eine Absturzschleife, ohne
# dass ein Deploy stattgefunden haette.
# Version mit der `prisma`-devDependency in package.json synchron halten.
CMD ["sh", "-c", "cd /migrate && ./node_modules/.bin/prisma migrate deploy && cd /app && exec node server.js"]
