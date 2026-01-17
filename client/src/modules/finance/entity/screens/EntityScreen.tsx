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

interface Entity {
  id: string
  type: string
  name: string
}

const API_URL = 'http://localhost:3000'

const fetchEntities = async (): Promise<Entity[]> => {
  const res = await fetch(`${API_URL}/api/entities`)
  const data = await res.json()
  return data.entities || []
}

const createEntity = async (entity: { type: string; name: string }) => {
  const res = await fetch(`${API_URL}/api/entities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entity),
  })
  return res.json()
}

const updateEntity = async (id: string, updates: { type?: string; name?: string }) => {
  const res = await fetch(`${API_URL}/api/entities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return res.json()
}

const deleteEntity = async (id: string) => {
  const res = await fetch(`${API_URL}/api/entities/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

export default function EntityScreen() {
  const queryClient = useQueryClient()
  const [type, setType] = useState('')
  const [name, setName] = useState('')

  const { data: entities = [], isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: fetchEntities,
  })

  const createMutation = useMutation({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      setType('')
      setName('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { type?: string; name?: string } }) =>
      updateEntity(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
    },
  })

  const columns: ColumnDef<Entity>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      size: 150,
      cell: (info) => (
        <EditableCell
          value={info.getValue() as string}
          onSave={async (newValue: string | number) => {
            await updateMutation.mutateAsync({
              id: info.row.original.id,
              updates: { type: newValue as string },
            })
          }}
          className="text-foreground font-medium rounded px-2 py-1 -mx-2 -my-1 hover:bg-secondary/50 transition-colors"
        />
      ),
    },
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
            onClick={() => deleteMutation.mutate(row.original.id)}
            disabled={deleteMutation.isPending}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
            title="Delete entity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: entities,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type.trim() && name.trim()) {
      createMutation.mutate({ type, name })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground mb-1">Entities</h1>
          <p className="text-sm text-muted-foreground">Click any field to edit</p>
        </div>

        {/* Add New Entity Card */}
        <div className="mb-6 p-4 rounded-xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={cn(
                "flex-1 px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground text-sm",
                "border border-border rounded-lg shadow-sm",
                "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md focus:outline-none",
                "transition-all duration-200"
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && type.trim() && name.trim()) {
                  createMutation.mutate({ type, name })
                }
              }}
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "flex-1 px-3 py-2 bg-input text-foreground placeholder:text-muted-foreground text-sm",
                "border border-border rounded-lg shadow-sm",
                "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md focus:outline-none",
                "transition-all duration-200"
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && type.trim() && name.trim()) {
                  createMutation.mutate({ type, name })
                }
              }}
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !type.trim() || !name.trim()}
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

        {/* Table */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading entities...
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-destructive text-sm">
              <span>Error loading entities</span>
            </div>
          </div>
        ) : entities.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-muted-foreground text-sm">No entities yet</div>
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
                            width: header.getSize() === 150 ? '150px' : header.getSize() === 300 ? '300px' : header.getSize() === 40 ? '40px' : 'auto',
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
                            width: cell.column.getSize() === 150 ? '150px' : cell.column.getSize() === 300 ? '300px' : cell.column.getSize() === 40 ? '40px' : 'auto',
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
        {entities.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{entities.length}</span> {entities.length === 1 ? 'entity' : 'entities'}
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

