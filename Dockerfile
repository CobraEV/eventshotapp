# ------------------------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------------------------
FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

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

RUN corepack enable && corepack prepare pnpm@latest --activate

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

RUN corepack enable && corepack prepare pnpm@latest --activate

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

USER nextjs

EXPOSE 3000

# The Prisma CLI version MUST stay pinned here.
# `pnpm dlx prisma` resolves the `latest` dist-tag on npm at EVERY container
# start. On 2026-08-25 that tag moved to 8.0.0-rc.10, where `prisma migrate`
# was renamed to `prisma migration`. The command exited 2, `&&` short-circuited,
# server.js never ran and the container crash-looped without any deploy having
# happened. Keep in sync with the `prisma` devDependency in package.json
# (and therefore with the generated @prisma/client).
CMD ["sh", "-c", "pnpm dlx prisma@7.4.0 migrate deploy && node server.js"]
