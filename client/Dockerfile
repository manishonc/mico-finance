# Stage 1: build
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy lockfile and manifests first for layer caching
COPY bun.lock package.json ./
COPY client/package.json ./client/

# Install all deps from root (bun workspaces)
RUN bun install --frozen-lockfile

# Copy source
COPY client/ ./client/

# Build-time env vars for Vite (baked into JS bundle)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app/client
RUN bun run build

# Stage 2: runtime
FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app/client/.output ./.output

ENV PORT=3000
EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
