import { createFileRoute } from '@tanstack/react-router'
import { EntityScreen } from '../../../modules/finance/entity'
import { ProtectedRoute } from '@/lib/middleware'

export const Route = createFileRoute('/finance/entity/')({
  component: () => (
    <ProtectedRoute>
      <EntityScreen />
    </ProtectedRoute>
  ),
})
