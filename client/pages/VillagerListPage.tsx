import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { VillagerCategory, SavedVillager } from '../components/models/villager'

interface VillagerSearchResult {
  name: string
  species: string
  nh_details?: {
    icon_url: string
  }
}

export function VillagerListPage() {
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()

  const [activeTab, setActiveTab] = useState<VillagerCategory>('CURRENT')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<VillagerSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedVillager, setSelectedVillager] = useState<VillagerSearchResult | null>(null)

  const [villagers, setVillagers] = useState<SavedVillager[]>([])

  const loadVillagers = () => {
    const saved = localStorage.getItem('user_saved_villagers')
    if (!saved) {
      setVillagers([])
      localStorage.setItem('user_saved_villagers', JSON.stringify([]))
      return
    }
    try {
      setVillagers(JSON.parse(saved))
    } catch {
      setVillagers([])
    }
  }

  useEffect(() => {
    loadVillagers()

    const handleFocus = () => loadVillagers()
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'user_saved_villagers') {
        loadVillagers()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorage as EventListener)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorage as EventListener)
    }
  }, [])

  const saveVillagersToStorage = (updatedList: SavedVillager[]) => {
    setVillagers(updatedList)
    localStorage.setItem('user_saved_villagers', JSON.stringify(updatedList))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const token = await getAccessTokenSilently()

      const res = await fetch(`/api/v1/nookipedia/search?name=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Nookipedia request failed')
      const data = await res.json()
      setSearchResults(Array.isArray(data) ? data : [data])
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddVillager = (category: VillagerCategory) => {
    if (!selectedVillager) return

    const villagerId = selectedVillager.name.toLowerCase().replace(/\s+/g, '-')
    const newVillager: SavedVillager = {
      id: villagerId,
      name: selectedVillager.name,
      species: selectedVillager.species,
      icon: selectedVillager.nh_details?.icon_url || '',
      category,
      friendshipPoints: category === 'CURRENT' ? 25 : 0,
      imageUrl: '',
      colors: (selectedVillager as any).nh_details?.fav_colors || ['Pink', 'White'],
      styles: (selectedVillager as any).nh_details?.fav_styles || ['Cute', 'Active']
    }

    const filtered = villagers.filter((v) => v.id !== newVillager.id)
    const updated = [...filtered, newVillager]
    saveVillagersToStorage(updated)

    setSelectedVillager(null)
    setSearchQuery('')
    setSearchResults([])
    setIsModalOpen(false)
  }

  const displayedVillagers = villagers.filter((v: SavedVillager) => v.category === activeTab)

  return (
    <div className="app-container">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/')}
          className="logout-btn"
          style={{ width: 'auto', borderRadius: '12px', padding: '0 0.75rem', fontSize: '0.8rem', height: '32px' }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#2D2B2A' }}>My Villagers</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2D4B43',
            color: '#FFF',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          }}
          title="Add New Villager"
        >
          +
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        {(['CURRENT', 'HISTORICAL', 'DESIRED'] as VillagerCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              flex: 1,
              padding: '0.6rem 0.2rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === cat ? '#EAF3EC' : '#F5F2EC',
              color: activeTab === cat ? '#2D4B43' : '#7A756C',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {cat === 'CURRENT' ? '🏡 Current' : cat === 'HISTORICAL' ? '📜 Past' : '✨ Desired'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayedVillagers.length === 0 ? (
          <div className="summary-card" style={{ textAlign: 'center', color: '#7A756C', padding: '2rem 1rem' }}>
            No {activeTab.toLowerCase()} villagers added yet. Click <strong>+</strong> to search and add one!
          </div>
        ) : (
          displayedVillagers.map((v) => {
            const villagerId = v.id || v.name.toLowerCase().replace(/\s+/g, '-')

            return (
              <div
                key={villagerId}
                className="summary-card"
                onClick={() => navigate(`/villagers/${villagerId}/interact`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/villagers/${villagerId}/interact`)
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <img src={v.icon} alt={v.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#2D2B2A' }}>{v.name}</h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: '#7A756C' }}>{v.species}</p>
                </div>
                {v.category === 'CURRENT' && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#E87A5D' }}>
                    ❤️ {v.friendshipPoints ?? 0} pts
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="summary-card" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Search & Add Villager</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSearchResults([])
                  setSearchQuery('')
                  setSelectedVillager(null)
                }}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#7A756C' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search villager name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CCC', fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                className="logout-btn"
                style={{ width: 'auto', padding: '0 0.85rem', height: 'auto', borderRadius: '8px', fontSize: '0.8rem' }}
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div 
                style={{ 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E0DAD0', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  marginBottom: '1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.2rem',
                  padding: '0.3rem'
                }}
              >
                {searchResults.map((res) => (
                  <div
                    key={res.name}
                    onClick={() => {
                      setSelectedVillager(res)
                      setSearchResults([])
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        setSelectedVillager(res)
                        setSearchResults([])
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedVillager?.name === res.name ? '#EAF3EC' : 'transparent',
                    }}
                  >
                    {res.nh_details?.icon_url && (
                      <img src={res.nh_details.icon_url} alt={res.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    )}
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: '#2D2B2A' }}>{res.name}</strong>
                      <div style={{ fontSize: '0.7rem', color: '#7A756C' }}>{res.species}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedVillager && (
              <div style={{ borderTop: '1px solid #EEE', paddingTop: '0.75rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 'bold', color: '#2D2B2A' }}>
                  Save {selectedVillager.name} as:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleAddVillager('CURRENT')}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#2D4B43', color: '#FFF', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    🏡 Current Villager
                  </button>
                  <button
                    onClick={() => handleAddVillager('HISTORICAL')}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FAF7F2', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    📜 Past / Historical Villager
                  </button>
                  <button
                    onClick={() => handleAddVillager('DESIRED')}
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #CCC', backgroundColor: '#FAF7F2', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    ✨ Desired Villager
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}