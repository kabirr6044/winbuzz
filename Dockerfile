# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --include=dev

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=10000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Captured pages are read by filename at runtime and must be included explicitly.
COPY --from=builder --chown=node:node /app/reference/pages ./reference/pages
COPY --from=builder --chown=node:node /app/reference/scores.json ./reference/scores.json
COPY --from=builder --chown=node:node /app/reference/inventory.json ./reference/inventory.json

USER node
EXPOSE 10000
CMD ["node", "server.js"]
