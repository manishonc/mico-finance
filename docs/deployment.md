# Deployment Guide

This guide covers deploying mico-finance to [Coolify](https://coolify.io) using Docker, with [Neon](https://neon.tech) as the managed Postgres database.

## Architecture

```
Coolify
  ├── client container   →  https://<client-domain>   (TanStack Start / Nitro SSR)
  └── server container   →  https://<server-domain>   (Hono.js / Bun)
                                    └── Neon Postgres (external, cloud)
```

The client is a server-side rendered app (Nitro). It proxies `/api/**` requests to the server at runtime. There is no Docker network dependency between the two — they communicate over their public URLs.

---

## Prerequisites

- A Coolify instance with Docker support
- A [Neon](https://neon.tech) project with a Postgres database
- Google OAuth credentials (optional, for social login)

---

## 1. Neon Database Setup

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the **pooled connection string** from the dashboard — it looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Run migrations against the Neon database before first deploy:
   ```bash
   DATABASE_URL=<your-neon-url> bun run db:migrate
   ```

---

## 2. Deploy the Server

### Create a new Coolify service

- **Source**: this Git repository
- **Dockerfile path**: `server/Dockerfile`
- **Build context**: repository root (`.`)
- **Port**: `3000`

### Environment variables (runtime)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Neon pooled connection string |
| `BETTER_AUTH_SECRET` | Random secret (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `https://<server-domain>` |
| `CLIENT_URL` | `https://<client-domain>` (comma-separated if multiple) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `PORT` | `3000` |

> `CLIENT_URL` controls both the CORS `Access-Control-Allow-Origin` header and `better-auth` trusted origins. If you have multiple client URLs (e.g. staging + production), separate them with commas: `https://app.example.com,https://staging.example.com`

---

## 3. Deploy the Client

### Create a new Coolify service

- **Source**: this Git repository
- **Dockerfile path**: `client/Dockerfile`
- **Build context**: repository root (`.`)
- **Port**: `3000`

### Build-time environment variables

> These are baked into the JS bundle at build time. Changing them requires a redeploy.

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<server-domain>` |

### Runtime environment variables

| Variable | Value |
|---|---|
| `PORT` | `3000` |

---

## 4. Google OAuth Callback URL

After both services are deployed, update your Google OAuth app's **Authorised redirect URIs** to include:

```
https://<server-domain>/api/auth/callback/google
```

---

## 5. Verify the Deployment

1. Open `https://<client-domain>` — the app should load
2. Sign up / sign in — auth requests should reach the server
3. Open browser DevTools → Network tab and confirm API calls go to `https://<server-domain>`
4. Check the server response headers include `Access-Control-Allow-Origin: https://<client-domain>`

---

## Local Development

Local dev does not use Docker. Run the server and client in separate terminals:

```bash
# Terminal 1 — server (port 3000)
bun run dev

# Terminal 2 — client (port 5000)
bun run client:run
```

The root `.env` is used for both. The client's Nitro proxy forwards `/api/**` to `http://localhost:3000` by default (via `client/nitro.config.ts`).

### Local environment (`.env`)

```env
VITE_API_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=<any-random-string>
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

---

## Database Commands

```bash
# Generate migration files from schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio

# Seed the database with sample data
bun run db:seed
```

---

## Environment Variable Reference

See `.env.example` at the repository root for a full list of required variables with descriptions.

| Variable | Where set | Required |
|---|---|---|
| `DATABASE_URL` | Server runtime | Yes |
| `BETTER_AUTH_SECRET` | Server runtime | Yes |
| `BETTER_AUTH_URL` | Server runtime | Yes |
| `CLIENT_URL` | Server runtime | Yes |
| `GOOGLE_CLIENT_ID` | Server runtime | Only for Google login |
| `GOOGLE_CLIENT_SECRET` | Server runtime | Only for Google login |
| `VITE_API_URL` | Client build-time | Yes |
| `PORT` | Both runtime | No (defaults to `3000`) |
