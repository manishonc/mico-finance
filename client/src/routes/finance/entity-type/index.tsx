import { createFileRoute } from '@tanstack/react-router'
import { EntityTypeScreen } from '../../../modules/finance/entity-type'
import { ProtectedRoute } from '@/lib/middleware'

export const Route = createFileRoute('/finance/entity-type/')({
  component: () => (
    <ProtectedRoute>
      <EntityTypeScreen />
    </ProtectedRoute>
  ),
})
