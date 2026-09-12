import { useAuth0 } from '@auth0/auth0-react'

export function Header() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

  return (
    <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <h1>ACNH Gift Guide</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isLoading ? (
          <span style={{ fontSize: '0.8rem', color: '#8A857B' }}>Loading...</span>
        ) : isAuthenticated ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2D2B2A' }}>
                {user?.given_name || user?.name || 'Player'}
              </span>
            </div>

            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="logout-btn"
              style={{
                borderRadius: '10px',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                backgroundColor: '#E87A5D',
                color: '#FFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect({ authorizationParams: { prompt: 'login' } })}
            className="login-btn"
            style={{
              borderRadius: '10px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              backgroundColor: '#2D4B43',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        )}
      </div>
    </header>
  )
}