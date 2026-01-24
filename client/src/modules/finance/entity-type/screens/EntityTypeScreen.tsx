'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { Trash2, Plus } from 'lucide-react'
import { EditableCell } from '@/components/EditableCell'
import { cn } from '@/lib/utils'

interface EntityType {
  id: string
  name: string
}

const API_URL = 'http://localhost:3000'

const fetchEntityTypes = async (): Promise<EntityType[]> => {
  const res = await fetch(`${API_URL}/api/entity-types`, {
    credentials: 'include',
  })
  const data = await res.json()
  return data.entityTypes || []
}

const createEntityType = async (entityType: { name: string }) => {
  const res = await fetch(`${API_URL}/api/entity-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entityType),
    credentials: 'include',
  })
  return res.json()
}

const updateEntityType = async (id: string, updates: { name?: string }) => {
  const res = await fetch(`${API_URL}/api/entity-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
    credentials: 'include',
  })
  return res.json()
}

const deleteEntityType = async (id: string) => {
  const res = await fetch(`${API_URL}/api/entity-types/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  return res.json()
}

export default function EntityTypeScreen() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: entityTypes = [], isLoading, error } = useQuery({
    queryKey: ['entity-types'],
    queryFn: fetchEntityTypes,
  })

  const createMutation = useMutation({
    mutationFn: createEntityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] })
      setName('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { name?: string } }) =>
      updateEntityType(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEntityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-types'] })
      setDeleteError(null)
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || 'Failed to delete entity type'
      setDeleteError(errorMsg)
    },
  })

  const columns: ColumnDef<EntityType>[] = [
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
            title="Delete entity type"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: entityTypes,
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
          <h1 className="text-3xl font-semibold text-foreground mb-1">Entity Types</h1>
          <p className="text-sm text-muted-foreground">Manage entity types. Click any field to edit</p>
        </div>

        {/* Add New Entity Type Card */}
        <div className="mb-6 p-4 rounded-xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Entity Type Name"
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

        {/* Error message for delete failures */}
        {deleteError && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{deleteError}</p>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading entity types...
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-destructive text-sm">
              <span>Error loading entity types</span>
            </div>
          </div>
        ) : entityTypes.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-muted-foreground text-sm">No entity types yet</div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-border bg-secondary/50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider"
                          style={{
                            width: header.getSize() === 300 ? '300px' : header.getSize() === 40 ? '40px' : 'auto',
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border/60 hover:bg-secondary/30 transition-colors group",
                        idx === table.getRowModel().rows.length - 1 ? 'border-b-0' : ''
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-2.5 overflow-hidden"
                          style={{
                            width: cell.column.getSize() === 300 ? '300px' : cell.column.getSize() === 40 ? '40px' : 'auto',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {entityTypes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{entityTypes.length}</span> {entityTypes.length === 1 ? 'type' : 'types'}
              </span>
              <span className="text-muted-foreground text-xs">
                Click cells to edit
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
