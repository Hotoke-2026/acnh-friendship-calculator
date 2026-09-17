import { Link } from 'react-router-dom'
import { SavedVillager } from './models/villager'

interface VillagerCardProps {
  villager: SavedVillager
}

export function VillagerCard({ villager }: VillagerCardProps) {
  const villagerName = villager.name.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="villager-card">
      <Link 
        to={`/villagers/${villagerName}/interact`} 
        className="villager-info" 
        style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}
      >
        <img 
          src={villager.imageUrl || villager.icon} 
          alt={villager.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.hasFailed) {
              target.dataset.hasFailed = 'true';
              target.src = '/path/to/local/fallback-avatar.png';
            }
          }}
        />
        <div>
          <h4>{villager.name}</h4>
          <span className="species">{villager.species}</span>
          <div className="friendship-status">❤️ {villager.friendshipPoints ?? 0} pts</div>
        </div>
      </Link>
    </div>
  )
}