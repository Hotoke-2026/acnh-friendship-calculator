import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useNavigate } from 'react-router-dom'
import { useVillagers } from '../hooks/useVillagers'
import { VillagerCard } from '../components/VillagerCard'
import { SavedVillager } from '../components/models/villager'

export function DashboardPage() {
  const navigate = useNavigate()
  const { logout, loginWithRedirect, user, isAuthenticated, isLoading: authLoading } = useAuth0()
  
  const [villagers, setVillagers] = useState<SavedVillager[]>([])

  useEffect(() => {
    const loadVillagers = () => {
      const saved = localStorage.getItem('user_saved_villagers')
      if (saved) {
        try {
          setVillagers(JSON.parse(saved))
        } catch {
          setVillagers([])
        }
      }
    }

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

  if (authLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Initializing Auth0...</div>
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>You are currently logged out</h2>
        <p>Please log in to view your island friendship tracker.</p>
        <button
          onClick={() => loginWithRedirect({ authorizationParams: { prompt: 'login' } })}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            backgroundColor: '#2D4B43',
            color: '#FFF',
            border: 'none',
            cursor: 'pointer',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
        >
          Log In
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <span className="island-tag">NIGHT VALE</span>
          <h1>Good morning, {user?.given_name || user?.name || 'Player'}!</h1>
          <p className="date-string">Friday · September 11</p>
        </div>
        <button
          className="logout-btn"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          title="Log Out"
        >
          👤
        </button>
      </header>

      <section className="summary-card">
        <div className="card-header">
          <div>
            <h2>Island friendships</h2>
            <p>Keep growing your favorite bonds</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box neutral">
            <div className="stat-icon">👤</div>
            <strong>{villagers.length}</strong>
            <div className="stat-label">Villagers</div>
          </div>
          <div className="stat-box pink">
            <div className="stat-icon">👕</div>
            <strong>42</strong>
            <div className="stat-label">Clothes</div>
          </div>
        </div>
      </section>

      <section className="villagers-section">
        <div className="section-header">
          <h3>My villagers</h3>
          <button onClick={() => navigate('/villagers')} className="see-all-btn">
            See all {villagers.filter((v: SavedVillager) => v.category === 'CURRENT').length} →
          </button>
        </div>

        <div className="villager-list">
          {villagers
            .filter((v: SavedVillager) => v.category === 'CURRENT')
            .map((v: SavedVillager) => (
              <VillagerCard 
                key={v.id || v.name} 
                villager={v} 
                totalCurrentVillagers={villagers.filter((item: SavedVillager) => item.category === 'CURRENT').length} 
              />
            ))}
        </div>
      </section>

      <section className="closet-banner">
        <div className="banner-header">
          <div>
            <span className="subtitle">Closet collection</span>
            <h3>42 pieces</h3>
            <span className="meta">12 new finds this month</span>
          </div>
          <Link to="/wardrobe" className="closet-link">
            View closet →
          </Link>
        </div>

        <div className="closet-categories">
          <div className="category-pill">👕 Tops</div>
          <div className="category-pill">👗 Dresses</div>
          <div className="category-pill">👑 Headwear</div>
        </div>
      </section>
    </div>
  )
}