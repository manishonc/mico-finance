# CI/CD Setup: Branch Protection & DB Migration Workflow

## Overview

This repo uses a **staging → main** promotion model. All changes must pass through `staging` before reaching `main` (production). Database migrations run automatically on each environment when code is pushed.

---

## Branch Strategy

```
feature/* ──→ staging ──→ main
                 ↓             ↓
           staging DB    production DB
```

- **`staging`** — integration branch, deployed to the staging environment
- **`main`** — production branch, protected and only updatable via PR from `staging`

---

## Workflows

### 1. `validate-pr-source.yml`

**Trigger:** Any pull request targeting `main`

**Purpose:** Enforces that only PRs from the `staging` branch can merge into `main`. Any PR from any other branch (e.g. a feature branch directly to main) will fail this check and be blocked.

```
PR opened → main
      ↓
check-source-branch job runs
      ↓
source == "staging"?  ✅ passes  /  ❌ fails + blocks merge
```

This job (`check-source-branch`) is registered as a **required status check** on `main`, so GitHub will not allow the merge button to be clicked until it passes.

---

### 2. `db-migrate.yml`

**Trigger:** Push to `staging` or `main`

**Purpose:** Runs `bun run db:migrate` (which calls `drizzle-kit migrate`) against the appropriate database when code lands on either branch.

| Branch push | Job that runs | Database used |
|-------------|---------------|---------------|
| `staging`   | `migrate-staging` | `STAGING_DATABASE_URL` secret |
| `main`      | `migrate-production` | `PRODUCTION_DATABASE_URL` secret |

---

## Branch Protection Rules (main)

Configured via GitHub API. Rules applied to `main`:

| Rule | Setting |
|------|---------|
| Require pull request before merging | Yes |
| Required approving reviews | 0 (PR required, no manual approval needed) |
| Required status checks | `check-source-branch` must pass |
| Strict status checks (branch must be up to date) | Yes |
| Enforce rules for administrators | Yes |
| Allow force pushes | No |
| Allow deletions | No |

> `enforce_admins: true` means even the repo owner cannot bypass these rules.

---

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `STAGING_DATABASE_URL` | Neon connection string for the staging database |
| `PRODUCTION_DATABASE_URL` | Neon connection string for the production database |

These are injected as environment variables at runtime and are never stored in the repository.

---

## End-to-End Flow

### Deploying a change to staging

```
1. Create a feature branch off staging
2. Open PR: feature/* → staging
3. Merge PR into staging
4. db-migrate.yml triggers:
     migrate-staging job runs
     drizzle-kit migrate → Neon staging DB
```

### Promoting staging to production

```
1. Open PR: staging → main
2. validate-pr-source.yml runs:
     ✅ source is "staging" → check passes
3. Merge PR into main
4. db-migrate.yml triggers:
     migrate-production job runs
     drizzle-kit migrate → Neon production DB
```

### Blocked scenarios

```
PR from feature/* → main
     ↓
check-source-branch: ❌ FAILS
     ↓
GitHub blocks the merge
```

```
Direct push to main
     ↓
GitHub branch protection: ❌ REJECTED
(even for repo owner)
```

---

## File Reference

```
.github/
├── workflows/
│   ├── validate-pr-source.yml   # Blocks non-staging PRs to main
│   └── db-migrate.yml           # Runs migrations on staging + main push
└── CI_CD_SETUP.md               # This file

drizzle.config.ts                # Reads DATABASE_URL env var for migrations
```
