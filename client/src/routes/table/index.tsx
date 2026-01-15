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
            completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            pending: 'bg-amber-50 text-amber-700 border border-amber-200',
            failed: 'bg-rose-50 text-rose-700 border border-rose-200',
          }
          return (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
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
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">
                Financial Transactions
              </h1>
              <p className="text-gray-500 text-sm">
                View and manage your financial transactions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="text-gray-900 font-medium">
                  {table.getFilteredRowModel().rows.length}
                </span>{' '}
                of{' '}
                <span className="text-gray-700">
                  {table.getCoreRowModel().rows.length}
                </span>{' '}
                transactions
              </p>
              {columnFilters.length > 0 && (
                <button
                  onClick={() => setColumnFilters([])}
                  className="mt-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                <tr className="bg-white border-b border-gray-100">
                  {table.getHeaderGroups()[0].headers.map((header) => {
                    const column = header.column
                    const filterValue = column.getFilterValue() as string
                    const columnId = column.id

                    return (
                      <td key={header.id} className="px-3 py-2">
                        {columnId === 'category' ? (
                          <div className="relative">
                            <select
                              value={filterValue ?? ''}
                              onChange={(e) =>
                                column.setFilterValue(
                                  e.target.value === '' ? undefined : e.target.value
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 appearance-none cursor-pointer pr-8"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 6px center',
                                backgroundSize: '16px',
                              }}
                            >
                              <option value="">All</option>
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : columnId === 'status' ? (
                          <div className="relative">
                            <select
                              value={filterValue ?? ''}
                              onChange={(e) =>
                                column.setFilterValue(
                                  e.target.value === '' ? undefined : e.target.value
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 appearance-none cursor-pointer pr-8"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 6px center',
                                backgroundSize: '16px',
                              }}
                            >
                              <option value="">All</option>
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : columnId === 'amount' ? (
                          <input
                            type="text"
                            value={filterValue ?? ''}
                            onChange={(e) =>
                              column.setFilterValue(
                                e.target.value === '' ? undefined : e.target.value
                              )
                            }
                            placeholder="Filter"
                            className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
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
                            placeholder="Filter"
                            className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-75"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-700"
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
