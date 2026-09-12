import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'

export function useVillagers() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['villagers'],
    queryFn: async () => {
      let headers: Record<string, string> = {}

      if (isAuthenticated) {
        const token = await getAccessTokenSilently()
        headers.Authorization = `Bearer ${token}`
      }

      const res = await fetch('/api/v1/villagers', { headers })
      if (!res.ok) {
        throw new Error('Failed to fetch villagers')
      }
      return res.json()
    },
    enabled: isAuthenticated,
  })
}