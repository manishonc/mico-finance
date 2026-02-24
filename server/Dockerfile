FROM oven/bun:1 AS builder
WORKDIR /app

COPY bun.lock package.json ./
COPY server/ ./server/

RUN bun install --frozen-lockfile

FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app .

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "server/index.ts"]
