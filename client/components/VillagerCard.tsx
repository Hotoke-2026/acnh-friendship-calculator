import { Link } from 'react-router-dom'
import { SavedVillager } from './models/villager'

interface VillagerCardProps {
  villager: SavedVillager
}

export function VillagerCard({ villager }: VillagerCardProps) {
  return (
    <div className="villager-card">
      <div className="villager-info">
        <img src={villager.icon} alt={villager.name} className="villager-icon" />
        <div>
          <h4>{villager.name}</h4>
          <span className="species">{villager.species}</span>
          {villager.styles && villager.colors && (
            <div className="villager-tags" style={{ display: 'flex', gap: '0.25rem', margin: '0.25rem 0', flexWrap: 'wrap' }}>
              <span className="tag style-tag" style={{ fontSize: '0.75rem', color: '#666' }}>
                ✨ {villager.styles.join(', ')}
              </span>
              <span className="tag color-tag" style={{ fontSize: '0.75rem', color: '#666' }}>
                🎨 {villager.colors.join(', ')}
              </span>
            </div>
          )}
          <div className="friendship-status">❤️ {villager.friendshipPoints ?? 0} pts</div>
        </div>
      </div>

      <Link to={`/villagers/${villager.id}`} className="gift-link" title={`Interact with ${villager.name}`}>
        🎁
      </Link>
    </div>
  )
}