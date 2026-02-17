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

# # SMTP
# ARG SMTP_HOST
# ENV SMTP_HOST=$SMTP_HOST

# ARG SMTP_PORT
# ENV SMTP_PORT=$SMTP_PORT

# ARG SMTP_SECURE
# ENV SMTP_SECURE=$SMTP_SECURE

# ARG SMTP_USER
# ENV SMTP_USER=$SMTP_USER

# ARG SMTP_PASS
# ENV SMTP_PASS=$SMTP_PASS

# ARG SMTP_FROM
# ENV SMTP_FROM=$SMTP_FROM

ENV NODE_ENV=production

# Prisma + Next.js Build
RUN --mount=type=secret,id=DATABASE_URL \
  --mount=type=secret,id=SMTP_HOST \
  --mount=type=secret,id=SMTP_PORT \
  --mount=type=secret,id=SMTP_SECURE \
  export DATABASE_URL="$(cat /run/secrets/DATABASE_URL)" \
  && export SMTP_HOST="$(cat /run/secrets/SMTP_HOST)" \
  && export SMTP_PORT="$(cat /run/secrets/SMTP_PORT)" \
  && export SMTP_SECURE="$(cat /run/secrets/SMTP_SECURE)" \
  && pnpm exec prisma generate \
  && pnpm run build


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
