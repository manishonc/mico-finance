# Implementation Patterns Guide

## Pattern: Normalization Feature with Full CRUD APIs

This guide documents the pattern used to implement the EntityType feature, which can be reused for similar data normalization and management features.

### Use Cases
- Creating lookup/reference tables (entity types, categories, statuses, etc.)
- Normalizing repeated text values into separate tables
- Adding management UIs for configuration data
- Building data structures with foreign key relationships

---

## Architecture Overview

### Database Layer
1. **New reference table** with user scoping
2. **Update existing table** to use foreign keys
3. **Data migration** strategy
4. **Drizzle query functions** for CRUD

### Backend Layer
1. **REST API endpoints** (GET, POST, PUT, DELETE)
2. **Foreign key constraint error handling**
3. **User isolation/scoping** via middleware

### Frontend Layer
1. **Management screen** (add, edit, delete)
2. **Consumer screen** (use in dropdowns, displays)
3. **Navigation integration**
4. **TanStack Query integration**

---

## Implementation Checklist

### Phase 1: Database & Backend

#### Step 1.1: Define New Table in Schema
**File**: `server/db/schemas/schema.ts`

```typescript
// Template
export const [featureName]Table = pgTable("[feature_name]", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // Add other fields as needed
});

// Update existing table to reference new table
export const [parentTable] = pgTable("[parent_table]", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  [featureId]: uuid("[feature_id]").notNull().references(() => [featureName]Table.id, { onDelete: "restrict" }),
  // ... other fields
});
```

**Key Decisions**:
- Use `onDelete: "cascade"` for user → feature (delete user removes features)
- Use `onDelete: "restrict"` for feature → parent (can't delete in-use features)
- Always include `userId` for user scoping
- Use `uuid` for primary keys, `text` for foreign references to auth schema

#### Step 1.2: Generate and Run Migration
```bash
bun run db:generate
bun run db:migrate
```

**Migration Template** (auto-generated, but customize data migration):
```sql
-- Create new table
CREATE TABLE "[feature_name]" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "name" text NOT NULL
);

-- If migrating existing data, use a temp column approach:
-- 1. Create temp column with new type
ALTER TABLE "[parent_table]" ADD COLUMN "[feature_id]_new" uuid;

-- 2. Populate temp column with lookups
UPDATE "[parent_table]" p
SET "[feature_id]_new" = (
  SELECT f."id" FROM "[feature_name]" f
  WHERE f."user_id" = p."user_id" AND f."name" = p."[feature_id]"
);

-- 3. Drop old column, rename temp column
ALTER TABLE "[parent_table]" DROP COLUMN "[feature_id]";
ALTER TABLE "[parent_table]" RENAME COLUMN "[feature_id]_new" TO "[feature_id]";

-- 4. Add constraints
ALTER TABLE "[feature_name]" ADD CONSTRAINT fk FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade;
ALTER TABLE "[parent_table]" ADD CONSTRAINT fk FOREIGN KEY ("[feature_id]") REFERENCES "[feature_name]"("id") ON DELETE restrict;
```

#### Step 1.3: Add Query Functions
**File**: `server/db/queries.ts`

```typescript
import { [featureName]Table } from "./schemas/schema";
import { and, eq } from "drizzle-orm";

// Create
export const create[FeatureName] = async (data: typeof [featureName]Table.$inferInsert) => {
  return await db.insert([featureName]Table).values(data);
};

// Read by user
export const read[FeatureName]ByUser = async (userId: string) => {
  return await db
    .select()
    .from([featureName]Table)
    .where(eq([featureName]Table.userId, userId));
};

// Read by ID
export const read[FeatureName]ById = async (id: string) => {
  return await db
    .select()
    .from([featureName]Table)
    .where(eq([featureName]Table.id, id));
};

// Update
export const update[FeatureName] = async (
  id: string,
  updates: Partial<typeof [featureName]Table.$inferInsert>
) => {
  return await db
    .update([featureName]Table)
    .set(updates)
    .where(eq([featureName]Table.id, id));
};

// Delete with user check
export const delete[FeatureName] = async (id: string, userId: string) => {
  return await db
    .delete([featureName]Table)
    .where(and(eq([featureName]Table.id, id), eq([featureName]Table.userId, userId)));
};

// Update parent table query to include JOIN if needed
export const read[ParentTable]ByUser = async (userId: string) => {
  return await db
    .select({
      // ... original fields
      [featureName]: [featureName]Table.name,
    })
    .from([parentTable])
    .leftJoin([featureName]Table, eq([parentTable].[featureId], [featureName]Table.id))
    .where(eq([parentTable].userId, userId));
};
```

#### Step 1.4: Add API Routes
**File**: `server/index.ts`

```typescript
import { create[FeatureName], read[FeatureName]ByUser, /* ... */ } from './db/queries'

// Apply auth middleware to all routes
app.use('/api/[feature-names]/*', authMiddleware);

// GET all for user
app.get('/api/[feature-names]', async (c) => {
  const items = await read[FeatureName]ByUser(c.get("user").id);
  return c.json({ [featureNames]: items });
})

// GET by ID
app.get('/api/[feature-names]/:id', async (c) => {
  const id = c.req.param('id');
  const items = await read[FeatureName]ByUser(c.get("user").id);
  const filtered = items.filter(item => item.id === id);
  return c.json({ [featureName]: filtered[0] || null });
})

// POST create
app.post('/api/[feature-names]', async (c) => {
  const body = await c.req.json();
  await create[FeatureName]({ ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

// PUT update
app.put('/api/[feature-names]/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  await update[FeatureName](id, { ...body, userId: c.get("user").id });
  return c.json({ success: true });
})

// DELETE with FK constraint handling
app.delete('/api/[feature-names]/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await delete[FeatureName](id, c.get("user").id);
    return c.json({ success: true });
  } catch (error: any) {
    if (error.code === '23503') { // PostgreSQL FK violation
      return c.json({
        success: false,
        error: "Cannot delete [feature] that is in use"
      }, 400);
    }
    throw error;
  }
})
```

---

### Phase 2: Management UI

#### Step 2.1: Create Management Screen Component
**File**: `client/src/modules/finance/[feature-name]/screens/[FeatureName]Screen.tsx`

**Key Patterns**:
- Single responsibility: only manage the feature data
- Use TanStack Query for data fetching
- Use TanStack Table for display
- Include EditableCell for inline editing
- Handle errors (especially FK constraint errors on delete)

```typescript
'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table'
import { Trash2, Plus } from 'lucide-react'
import { EditableCell } from '@/components/EditableCell'
import { cn } from '@/lib/utils'

interface [FeatureName] {
  id: string
  name: string
  // Add other fields
}

const API_URL = 'http://localhost:3000'

const fetch[FeatureNames] = async (): Promise<[FeatureName][]> => {
  const res = await fetch(`${API_URL}/api/[feature-names]`, {
    credentials: 'include',
  })
  const data = await res.json()
  return data.[featureNames] || []
}

const create[FeatureName] = async ([featureName]: { name: string }) => {
  const res = await fetch(`${API_URL}/api/[feature-names]`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([featureName]),
    credentials: 'include',
  })
  return res.json()
}

const update[FeatureName] = async (id: string, updates: { name?: string }) => {
  const res = await fetch(`${API_URL}/api/[feature-names]/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
    credentials: 'include',
  })
  return res.json()
}

const delete[FeatureName] = async (id: string) => {
  const res = await fetch(`${API_URL}/api/[feature-names]/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return res.json()
}

export default function [FeatureName]Screen() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['[feature-names]'],
    queryFn: fetch[FeatureNames],
  })

  const createMutation = useMutation({
    mutationFn: create[FeatureName],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[feature-names]'] })
      setName('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { name?: string } }) =>
      update[FeatureName](id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[feature-names]'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: delete[FeatureName],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[feature-names]'] })
      setDeleteError(null)
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || 'Failed to delete'
      setDeleteError(errorMsg)
    },
  })

  const columns: ColumnDef<[FeatureName]>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 300,
      cell: (info) => (
        <EditableCell
          value={info.getValue() as string}
          onSave={async (newValue: string | number) => {
            await updateMutation.mutateAsync({
              id: info.row.original.id,
              updates: { name: newValue as string },
            })
          }}
          className="text-foreground/90 rounded px-2 py-1 -mx-2 -my-1 hover:bg-secondary/50 transition-colors"
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 40,
      cell: ({ row }) => (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setDeleteError(null)
              deleteMutation.mutate(row.original.id)
            }}
            disabled={deleteMutation.isPending}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      createMutation.mutate({ name })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-1">[Feature Names]</h1>
          <p className="text-sm text-muted-foreground">Manage [feature names]. Click any field to edit</p>
        </div>

        {/* Form Card */}
        <div className="mb-6 p-4 rounded-xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="[Feature Name]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "flex-1 px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground text-sm",
                "border border-border rounded-lg shadow-sm",
                "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md focus:outline-none",
                "transition-all duration-200"
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  createMutation.mutate({ name })
                }
              }}
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className={cn(
                "px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium",
                "flex items-center gap-1.5 transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              )}
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Error message */}
        {deleteError && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{deleteError}</p>
          </div>
        )}

        {/* Table - reuse standard pattern */}
        {isLoading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : error ? (
          <div className="py-12 text-center">Error loading</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-muted-foreground text-sm">No [feature names] yet</div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Standard table rendering */}
          </div>
        )}

        {/* Footer Stats */}
        {items.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <span className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">{items.length}</span> total
            </span>
          </div>
        )}
      </section>
    </div>
  )
}
```

#### Step 2.2: Create Module Export
**File**: `client/src/modules/finance/[feature-name]/index.ts`

```typescript
export { default as [FeatureName]Screen } from './screens/[FeatureName]Screen'
```

#### Step 2.3: Create Route
**File**: `client/src/routes/finance/[feature-name]/index.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { [FeatureName]Screen } from '../../../modules/finance/[feature-name]'
import { ProtectedRoute } from '@/lib/middleware'

export const Route = createFileRoute('/finance/[feature-name]/')({
  component: () => (
    <ProtectedRoute>
      <[FeatureName]Screen />
    </ProtectedRoute>
  ),
})
```

---

### Phase 3: Integration with Consumer Features

#### Step 3.1: Update Consumer Component
**Example**: Using features in EntityScreen

```typescript
// Fetch features
const { data: features = [] } = useQuery({
  queryKey: ['[feature-names]'],
  queryFn: fetch[FeatureNames],
})

// In form, replace text input with dropdown
<select value={[featureId]} onChange={(e) => set[FeatureId](e.target.value)}>
  <option value="">Select [Feature]</option>
  {features.map((f) => (
    <option key={f.id} value={f.id}>
      {f.name}
    </option>
  ))}
</select>

// In table, display feature name instead of ID
{
  accessorKey: '[featureName]',
  header: '[Feature]',
  cell: (info) => {
    const featureId = info.row.original.[featureId]
    const featureName = features.find(f => f.id === featureId)?.name || 'Unknown'
    return <span>{featureName}</span>
  },
}
```

#### Step 3.2: Add Navigation Link
**File**: `client/src/components/Header.tsx`

```typescript
import { [IconName] } from 'lucide-react'

<Link
  to="/finance/[feature-name]"
  onClick={() => setIsOpen(false)}
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
  activeProps={{
    className: 'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
  }}
>
  <[IconName] size={20} />
  <span className="font-medium">[Feature Names]</span>
</Link>
```

---

## Key Technical Decisions

### 1. User Scoping
- **Always include userId** on feature tables
- Use `eq(table.userId, userId)` in queries to isolate per-user
- Never query without user filter

### 2. Foreign Key Constraints
- Use `onDelete: "cascade"` for parent → dependent (user → features)
- Use `onDelete: "restrict"` for feature → parent (prevents deleting in-use features)
- Handle PostgreSQL error code `23503` (FK violation) in API delete endpoint

### 3. Data Migration
- Use **temp column approach** for safer migrations
- Keep old data until final rename
- Include WHERE clauses to skip null/empty values
- Test migration paths

### 4. Frontend Data Fetching
- Use TanStack Query for caching and refetching
- Invalidate parent and child queries on mutations
- Always include `credentials: 'include'` for auth cookies

### 5. Error Handling
- Display FK constraint errors to user (not in-use, etc.)
- Show delete errors in a dismissible alert
- Reset error state on retry

---

## Testing Checklist

### Backend
- [ ] POST - Create new feature
- [ ] GET - List all for user
- [ ] GET - Single by ID
- [ ] PUT - Update feature
- [ ] DELETE - Delete unused feature
- [ ] DELETE - Try delete in-use feature (should fail)
- [ ] User isolation - Verify users can only access their own

### Frontend Management
- [ ] Navigate to management screen
- [ ] Create new feature
- [ ] Edit feature inline
- [ ] Delete unused feature
- [ ] Error message on delete in-use
- [ ] Empty state display
- [ ] Loading/error states

### Frontend Integration
- [ ] Consumer component fetches features
- [ ] Dropdown displays all features
- [ ] Can create with feature selected
- [ ] Table displays feature name (not UUID)
- [ ] Can update feature in consumer
- [ ] Delete feature → update consumer display

### Data Integrity
- [ ] All features belong to correct user
- [ ] No orphaned consumer records
- [ ] Cascade deletes work (delete user → features deleted)
- [ ] Restrict deletes work (can't delete in-use features)

---

## Common Patterns

### Pattern: Dropdown Selection
```typescript
<select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
  <option value="">Select...</option>
  {items.map((item) => (
    <option key={item.id} value={item.id}>{item.name}</option>
  ))}
</select>
```

### Pattern: Display Foreign Key Name
```typescript
const itemName = items.find(item => item.id === row.original.itemId)?.name || 'Unknown'
<span>{itemName}</span>
```

### Pattern: FK Constraint Error Handling
```typescript
try {
  await deleteFunction(id, userId)
  return c.json({ success: true })
} catch (error: any) {
  if (error.code === '23503') {
    return c.json({ success: false, error: "Cannot delete..." }, 400)
  }
  throw error
}
```

---

## File Structure Template

```
Database:
  server/db/schemas/schema.ts - [FeatureName]Table definition
  server/db/queries.ts - CRUD functions
  server/db/migrations/XXXX_*.sql - Migration with data migration

Backend:
  server/index.ts - API routes (/api/[feature-names])

Frontend:
  client/src/modules/finance/[feature-name]/
    ├── screens/
    │   └── [FeatureName]Screen.tsx
    └── index.ts
  client/src/routes/finance/[feature-name]/
    └── index.tsx
  client/src/components/Header.tsx - Navigation link
  client/src/modules/finance/[consumer]/screens/[Consumer]Screen.tsx - Consumer integration
```

---

## Related Files to Review

For EntityType implementation example:
- `server/db/schemas/schema.ts` - entityTypeTable + entityTable FK
- `server/db/queries.ts` - CRUD functions + readEntityByUser JOIN
- `server/index.ts` - /api/entity-types routes
- `client/src/modules/finance/entity-type/screens/EntityTypeScreen.tsx` - Management UI
- `client/src/modules/finance/entity/screens/EntityScreen.tsx` - Consumer integration
- `client/src/components/Header.tsx` - Navigation

---

## Tips & Gotchas

✅ **Do**:
- Always include user scoping on every query
- Use temp columns for data migrations
- Handle FK errors gracefully
- Test user isolation
- Invalidate related queries on mutations

❌ **Don't**:
- Query without user filter (security issue)
- Try to cast text directly to UUID
- Delete features without checking if in-use
- Forget to add navigation links
- Skip error handling on delete operations

---

## Quick Start Checklist

When implementing a new normalization feature:

1. [ ] Create [FeatureName]Table in schema.ts
2. [ ] Update parent table with FK reference
3. [ ] Run `bun run db:generate` and customize migration
4. [ ] Run `bun run db:migrate`
5. [ ] Add CRUD functions to queries.ts
6. [ ] Add API routes to index.ts (with FK error handling)
7. [ ] Create [FeatureName]Screen.tsx
8. [ ] Create module index.ts and route
9. [ ] Add navigation link to Header.tsx
10. [ ] Update consumer component (dropdown + display)
11. [ ] Test all CRUD and FK scenarios
12. [ ] Test user isolation
