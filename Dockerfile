# --- Stage 1: Base image ---
  FROM node:20-bookworm-slim AS base
  WORKDIR /app
  
  # System- und Build-Abhängigkeiten installieren (für Build + Prisma)
  RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential libssl3 libxml2 libstdc++6 ca-certificates \
    ghostscript ffmpeg \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*
  
  
  # --- Stage 2: Dependencies ---
  FROM base AS deps
  
  ENV PNPM_RUN_BUILD_SCRIPTS=true
  
  RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
  
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --dangerously-allow-all-builds --frozen-lockfile
  
  
  # --- Stage 3: Build ---
  FROM base AS builder
  
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  
  ARG DATABASE_URL
  ENV DATABASE_URL=${DATABASE_URL}
  ENV SKIP_STATIC_BUILD=true
  
  # Prisma Client generieren
  RUN pnpm exec prisma generate
  
  # Next.js Standalone-Build
  RUN pnpm run build
  
  
  # --- Stage 4: Runtime ---
  FROM node:20-bookworm-slim AS runner
  WORKDIR /app
  
  ENV NODE_ENV=production \
    PORT=3000
  
  # Runtime-Abhängigkeiten installieren
  RUN apt-get update && apt-get install -y --no-install-recommends \
    libstdc++6 libxml2 ca-certificates ghostscript ffmpeg \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*
  
  # Non-root user with valid HOME directory and proper permissions
  RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs nextjs
  
  # Set HOME so pnpm & Prisma know where to write temporary files
  ENV HOME=/home/nextjs
  
  # Copy build output (still as root)
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/prisma ./prisma
  COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
  COPY --from=builder /app/.next/static ./.next/static
  
  # Ensure nextjs user can write to /app and pnpm cache paths
  RUN chown -R nextjs:nodejs /app /home/nextjs
  
  USER nextjs
  
  EXPOSE 3000
  
  # Safe runtime command (migrations + start)
  CMD ["sh", "-c", "pnpm dlx prisma migrate deploy && node server.js"]
