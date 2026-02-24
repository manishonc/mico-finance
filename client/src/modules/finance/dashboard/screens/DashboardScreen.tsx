import { Link } from '@tanstack/react-router'
import { Building2, Wallet } from 'lucide-react'

export default function DashboardScreen() {
  const entities = [
    {
      name: 'Entity',
      path: '/finance/entity',
      icon: <Building2 className="w-6 h-6" />,
      description: 'Manage financial entities',
    },
    // Future entities can be added here:
    // {
    //   name: 'Fee',
    //   path: '/finance/fee',
    //   icon: <DollarSign className="w-6 h-6" />,
    //   description: 'Manage fees',
    // },
    // {
    //   name: 'Transaction',
    //   path: '/finance/transaction',
    //   icon: <ArrowLeftRight className="w-6 h-6" />,
    //   description: 'Manage transactions',
    // },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Wallet className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Finance Dashboard</h1>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Finance Entities
            </h2>
            <div className="flex flex-wrap gap-4">
              {entities.map((entity) => (
                <Link
                  key={entity.name}
                  to={entity.path}
                  className="flex items-center gap-3 px-6 py-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700 transition-all duration-300 text-white font-medium"
                  activeProps={{
                    className:
                      'flex items-center gap-3 px-6 py-3 bg-cyan-600 border border-cyan-500 rounded-lg hover:bg-cyan-700 transition-all duration-300 text-white font-medium',
                  }}
                >
                  {entity.icon}
                  <span>{entity.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
