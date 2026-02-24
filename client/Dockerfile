# Stage 1: build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy lockfile and manifest first for layer caching
COPY client/bun.lock client/package.json ./

# Install deps
RUN bun install --frozen-lockfile

# Copy source
COPY client/ ./

# Build-time env var for Vite (baked into JS bundle)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

# Stage 2: runtime
FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV PORT=3000
EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
