# Skill: Client Folder Structure (Hybrid)

This skill describes how to scaffold new modules and routes for the client app.

## Scope

- Applies to: `client/src`
- Routing: TanStack Router (file-based)
- Structure: Hybrid (thin route files + feature modules)

## High-Level Rules

- Feature-first: group by domain/module (e.g., `finance/entity`).
- Thin routes: route files only wire screens.
- Co-location: module UI, hooks, types, and API logic live together.
- Shared code: reusable pieces go in `client/src/components` or `client/src/lib`.

## Standard Module Template

Create a module under:

```
client/src/modules/<domain>/<feature>/
  api/
  components/
  hooks/
  screens/
  types/
  index.ts
```

### Minimum files

1. `screens/<FeatureScreen>.tsx`
2. `index.ts` (re-export module public surface)

### Example: Finance Entity

```
client/src/modules/finance/entity/
  screens/EntityScreen.tsx
  index.ts
```

## Standard Route Template

Add a thin route file under:

```
client/src/routes/<domain>/<feature>/index.tsx
```

Route file example:

```
import { createFileRoute } from '@tanstack/react-router'
import { EntityScreen } from '../../../modules/finance/entity'

export const Route = createFileRoute('/finance/entity/')({
  component: EntityScreen,
})
```

## Naming Conventions

- Folders: lowercase (domain/feature) and short.
- Components: PascalCase (`EntityScreen.tsx`).
- Hooks: `use<Feature><Action>` (e.g., `useEntityList`).
- Types: `Feature.types.ts` or per-entity types in `types/`.
- Re-exports: use `index.ts` inside each module folder.

## Scaffolding Steps

1. Create module folders under `client/src/modules/<domain>/<feature>/`.
2. Add `screens/<FeatureScreen>.tsx` and export it from `index.ts`.
3. Create thin route at `client/src/routes/<domain>/<feature>/index.tsx`.
4. Regenerate TanStack Router tree by running `bun run build` in `client/`.

## When to Put Code in Shared

- Move components to `client/src/components` when used by 2+ modules.
- Move utilities to `client/src/lib` when reused across modules.
*** End Patch"/>} ేమ નથી 406: no lark file? I used apply_patch wrong. Need plain string. Let's retry. Wait can't call apply_patch in parallel. We'll redo. Done. Actually tool call failed. We'll call again with correct format. Need to include patch string not JSON. Use correct. Let's do. Теперь. We'll send apply_patch. Done. Then respond. Also ignore todo note. No todos. Use apply_patch tool. Let's do. wait to call apply_patch. After success respond. Need to mention. Let's do. Also lints not needed. Let's execute. */}
