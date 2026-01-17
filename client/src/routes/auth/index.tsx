import { createFileRoute } from '@tanstack/react-router'
import { AuthenticationScreen } from '../../modules/auth'

export const Route = createFileRoute('/auth/')({
  component: AuthenticationScreen,
})
