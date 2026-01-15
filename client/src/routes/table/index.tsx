import { createFileRoute } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

// Define the data type (TData)
type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  status: 'completed' | 'pending' | 'failed'
}

export const Route = createFileRoute('/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Column filters state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Create sample data with stable reference using useState
  const [data] = useState<Transaction[]>(() => [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Grocery Store Purchase',
      amount: -125.50,
      category: 'Food',
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-01-16',
      description: 'Salary Deposit',
      amount: 3500.00,
      category: 'Income',
      status: 'completed',
    },
    {
      id: '3',
      date: '2024-01-17',
      description: 'Electric Bill',
      amount: -85.25,
      category: 'Utilities',
      status: 'pending',
    },
    {
      id: '4',
      date: '2024-01-18',
      description: 'Restaurant Dinner',
      amount: -67.80,
      category: 'Food',
      status: 'completed',
    },
    {
      id: '5',
      date: '2024-01-19',
      description: 'Online Subscription',
      amount: -29.99,
      category: 'Entertainment',
      status: 'completed',
    },
    {
      id: '6',
      date: '2024-01-20',
      description: 'Failed Payment',
      amount: -150.00,
      category: 'Shopping',
      status: 'failed',
    },
  ])

  // Define column definitions with stable reference using useMemo
  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => {
          const date = info.getValue() as string
          return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => info.getValue(),
        filterFn: (row, id, value) => {
          return value === '' || row.getValue(id) === value
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => {
          const amount = info.getValue() as number
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
          return (
            <span
              className={amount >= 0 ? 'text-green-400' : 'text-red-400'}
            >
              {formatted}
            </span>
          )
        },
        filterFn: (row, id, value) => {
          if (!value || value === '') return true
          const rowValue = row.getValue(id) as number
          const filterValue = parseFloat(value as string)
          if (isNaN(filterValue)) return true
          // Filter by exact amount match (within 0.01 for floating point precision)
          return Math.abs(rowValue - filterValue) < 0.01
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string
          const statusColors = {
            completed: 'bg-green-500/20 text-green-400',
            pending: 'bg-yellow-500/20 text-yellow-400',
            failed: 'bg-red-500/20 text-red-400',
          }
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                statusColors[status as keyof typeof statusColors]
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )
        },
        filterFn: (row, id, value) => {
          return value === '' || row.getValue(id) === value
        },
      },
    ],
    []
  )

  // Set up table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  })

  // Get unique categories and statuses for filter dropdowns
  const categories = useMemo(
    () => Array.from(new Set(data.map((d) => d.category))).sort(),
    [data]
  )
  const statuses = useMemo(
    () => Array.from(new Set(data.map((d) => d.status))).sort(),
    [data]
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Financial Transactions
              </h1>
              <p className="text-gray-400">
                View and manage your financial transactions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">
                Showing{' '}
                <span className="text-cyan-400 font-semibold">
                  {table.getFilteredRowModel().rows.length}
                </span>{' '}
                of{' '}
                <span className="text-gray-300">
                  {table.getCoreRowModel().rows.length}
                </span>{' '}
                transactions
              </p>
              {columnFilters.length > 0 && (
                <button
                  onClick={() => setColumnFilters([])}
                  className="mt-2 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/80 border-b border-slate-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
                {/* Filter row */}
                <tr className="bg-slate-800/60 border-b border-slate-700">
                  {table.getHeaderGroups()[0].headers.map((header) => {
                    const column = header.column
                    const filterValue = column.getFilterValue() as string
                    const columnId = column.id

                    return (
                      <td key={header.id} className="px-6 py-3">
                        {columnId === 'category' ? (
                          <select
                            value={filterValue ?? ''}
                            onChange={(e) =>
                              column.setFilterValue(
                                e.target.value === '' ? undefined : e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        ) : columnId === 'status' ? (
                          <select
                            value={filterValue ?? ''}
                            onChange={(e) =>
                              column.setFilterValue(
                                e.target.value === '' ? undefined : e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            <option value="">All Statuses</option>
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : columnId === 'amount' ? (
                          <input
                            type="number"
                            value={filterValue ?? ''}
                            onChange={(e) =>
                              column.setFilterValue(
                                e.target.value === '' ? undefined : e.target.value
                              )
                            }
                            placeholder="Filter amount..."
                            className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          />
                        ) : (
                          <input
                            type="text"
                            value={filterValue ?? ''}
                            onChange={(e) =>
                              column.setFilterValue(
                                e.target.value === '' ? undefined : e.target.value
                              )
                            }
                            placeholder={`Filter ${columnId}...`}
                            className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-700/50 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
