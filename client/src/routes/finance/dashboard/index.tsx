import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '../../../modules/finance/dashboard'

export const Route = createFileRoute('/finance/dashboard/')({
  component: DashboardScreen,
})
