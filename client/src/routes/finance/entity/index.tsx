import { createFileRoute } from '@tanstack/react-router'
import { EntityScreen } from '../../../modules/finance/entity'

export const Route = createFileRoute('/finance/entity/')({
  component: EntityScreen,
})
