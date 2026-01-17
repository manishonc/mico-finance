import { createFileRoute } from '@tanstack/react-router'
import { HomeScreen } from '../modules/home'

export const Route = createFileRoute('/')({
  component: HomeScreen,
})
