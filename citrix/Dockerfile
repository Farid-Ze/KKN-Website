# ============================================================================
# [BASELINE 2017 LIVE FACTS & DOCKER DEPLOYMENT SPEC 2026]
# Authentic File Path: Dockerfile
# Status: [EMPIRICALLY VERIFIED AUDIT - NUXT 3 NITRO DOCKER CONTAINERIZATION]
# ============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy full source code
COPY . .

# Build Nuxt 3 production Nitro server
RUN npx nuxt build

# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NITRO_PRERENDER=false

# Copy built server output from builder stage
COPY --from=builder /app/.output ./.output
# Copy public assets to ensure they're available
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

CMD ["node", ".output/server/index.mjs"]
