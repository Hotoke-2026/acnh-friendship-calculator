import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

interface GiftItem {
  name: string
  category: string
  style: string
  color: string
  points: number
}

function GiftCardItem({ item }: { item: GiftItem }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['nookipediaClothing', item.name],
    queryFn: async () => {
      const res = await fetch(`/api/v1/nookipedia/clothing/${encodeURIComponent(item.name)}`)
      if (!res.ok) {
        throw new Error('Failed to fetch item data')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1,
  })

  const imageUrl = !isLoading && !isError && data?.imageUrl ? data.imageUrl : '/placeholder.png'

  return (
    <div className="gift-card" style={{ border: '1px solid #E0DBCF', borderRadius: '12px', padding: '1rem', textAlign: 'center', backgroundColor: '#FFF' }}>
      <div className="image-container" style={{ width: '64px', height: '64px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isLoading ? (
          <div style={{ fontSize: '0.75rem', color: '#8A857B' }}>Loading...</div>
        ) : (
          <img
            src={imageUrl}
            alt={item.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1rem', color: '#2D2B2A' }}>{item.name}</h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#6E6A66' }}>
        {item.category} — {item.style}/{item.color}
      </p>

      <button
        style={{
          backgroundColor: '#2D4B43',
          color: '#FFF',
          border: 'none',
          borderRadius: '20px',
          padding: '0.4rem 1rem',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Give (+{item.points} pts)
      </button>
    </div>
  )
}

export function VillagerInteractPage() {
  const { id } = useParams<{ id: string }>()
  const { getAccessTokenSilently } = useAuth0()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['villagerGiftOptions', id],
    queryFn: async () => {
      // Clean token retrieval using the audience already set in Auth0Provider
      const token = await getAccessTokenSilently()

      const res = await fetch(`/api/v1/villagers/${id}/gift-options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Failed to load villager options')
      return res.json()
    },
    enabled: Boolean(id),
  })

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading villager details...</div>
  }

  if (isError || !data || !data.villager) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Could not find villager details.</p>
        <Link to="/">Back to Villagers</Link>
      </div>
    )
  }

  const { villager, giftItems = [] } = data

  const tiers = [
    { label: '+5 Points Tier', points: 5 },
    { label: '+4 Points Tier', points: 4 },
    { label: '+3 Points Tier', points: 3 },
    { label: '+2 Points Tier', points: 2 },
    { label: '+1 Points Tier', points: 1 },
  ]

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: '#2D4B43', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to List
      </Link>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <img
          src={villager.imageUrl || villager.image_url}
          alt={villager.name}
          style={{ width: '96px', height: '96px', borderRadius: '50%' }}
        />
        <h2 style={{ margin: '0.5rem 0 0.2rem' }}>{villager.name}</h2>
        <p style={{ color: '#6E6A66', margin: 0 }}>
          {villager.personality} | Preferred Styles: {villager.styles?.join(', ')}
        </p>
      </div>

      <div className="gift-tiers-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tiers.map((tier) => {
          const itemsInTier = giftItems.filter((item: GiftItem) => item.points === tier.points)

          return (
            <div key={tier.points} className="tier-section">
              <h3 style={{ color: '#E87A5D', fontSize: '1rem', borderBottom: '1px solid #E0DBCF', paddingBottom: '0.25rem', marginBottom: '1rem' }}>
                {tier.label}
              </h3>

              {itemsInTier.length === 0 ? (
                <p style={{ color: '#8A857B', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  No collected items match this tier.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                  {itemsInTier.map((item: GiftItem, idx: number) => (
                    <GiftCardItem key={`${item.name}-${idx}`} item={item} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}