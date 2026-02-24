import { Link } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'

export default function HomeScreen() {
  const modules = [
    {
      name: 'Finance',
      description: 'Manage your financial entities, transactions, and records',
      path: '/finance/dashboard',
      icon: <Wallet className="w-16 h-16 text-cyan-400" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
              <span className="text-gray-300">LIFE</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                OS
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            Your life operating system
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            A comprehensive platform to manage all aspects of your life. Access
            powerful modules for finance, health, and more.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.name}
              to={module.path}
              className="block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{module.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {module.name}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
