import { defineNitroConfig } from 'nitro/config'

const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000'

export default defineNitroConfig({
  routeRules: {
    '/api/**': { proxy: `${apiUrl}/api/**` },
  },
})
