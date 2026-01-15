import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import { EditableCell } from '../../components/EditableCell'

export const Route = createFileRoute('/transaction/')({
  component: RouteComponent,
})

type Transaction = {
  id: string
  amount: number
  description: string
  date: string
  category: string
}

type TransactionsResponse = {
  transactions: Transaction[]
  totalAmount: { totalAmount: string }[]
}

const columnHelper = createColumnHelper<Transaction>()

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([])
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<TransactionsResponse>({
    queryKey: ['transactions'],
    queryFn: () =>
      fetch('http://localhost:3000/api/transactions').then((res) => res.json()),
  })

  const updateTransactionMutation = useMutation({
    mutationFn: async (updates: Partial<Transaction> & { id: string }) => {
      const { id, ...body } = updates
      await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const transactions = data?.transactions || []
  const totalAmount = data?.totalAmount?.[0]?.totalAmount
    ? Number(data.totalAmount[0].totalAmount)
    : 0

  const columns = [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => {
        const value = info.getValue()
        const dateStr = new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        return (
          <EditableCell
            value={dateStr}
            onSave={async (newValue) => {
              const transaction = info.row.original
              await updateTransactionMutation.mutateAsync({ id: transaction.id, date: newValue as string })
            }}
            className="text-gray-900"
          />
        )
      },
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => {
        const value = info.getValue()
        const transaction = info.row.original
        return (
          <EditableCell
            value={value}
            onSave={async (newValue) => {
              await updateTransactionMutation.mutateAsync({ id: transaction.id, category: newValue as string })
            }}
          />
        )
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => {
        const value = info.getValue()
        const transaction = info.row.original
        return (
          <EditableCell
            value={value}
            onSave={async (newValue) => {
              await updateTransactionMutation.mutateAsync({ id: transaction.id, description: newValue as string })
            }}
          />
        )
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => {
        const value = info.getValue()
        const transaction = info.row.original
        return (
          <EditableCell
            value={value}
            type="number"
            onSave={async (newValue) => {
              await updateTransactionMutation.mutateAsync({ id: transaction.id, amount: Number(newValue) })
            }}
            className={
              value < 0
                ? 'text-red-600 font-medium tabular-nums'
                : 'text-gray-900 font-medium tabular-nums'
            }
          />
        )
      },
    }),
  ]

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-red-500">Error loading transactions</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-medium text-gray-900 mb-6">Transactions</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total Amount:</span>{' '}
          <span
            className={
              totalAmount < 0
                ? 'text-red-600 font-medium tabular-nums'
                : 'text-gray-900 font-medium tabular-nums'
            }
          >
            ${Math.abs(totalAmount).toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No transactions</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-50 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {{
                            asc: <ArrowUp className="w-3.5 h-3.5" />,
                            desc: <ArrowDown className="w-3.5 h-3.5" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-gray-50 last:border-none hover:bg-gray-50/80 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2.5 text-sm text-gray-700"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
