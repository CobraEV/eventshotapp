# ------------------------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------------------------
FROM node:20-bookworm-slim AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# ------------------------------------------------------------
# Stage 2: Build
# ------------------------------------------------------------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Basic system deps only
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production
ENV NEXT_BUILD_WORKER_COUNT=1

# Prisma + Next.js Build
RUN pnpm exec prisma generate \
  && pnpm run build \
  && rm -rf .next/cache


# ------------------------------------------------------------
# Stage 3: Runtime
# ------------------------------------------------------------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOME=/home/nextjs

# Runtime deps only
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
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

CMD ["sh", "-c", "pnpm dlx prisma migrate deploy && node server.js"]
