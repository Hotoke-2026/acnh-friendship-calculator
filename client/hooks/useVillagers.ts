import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'

export function useVillagers() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

  return useQuery({
    queryKey: ['villagers'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()

      const res = await fetch('/api/v1/villagers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch villagers: ${res.statusText}`)
      }

      return res.json()
    },

    enabled: !isLoading && isAuthenticated,
  })
}