import { Link } from 'react-router-dom'
import { SavedVillager } from './models/villager'

interface VillagerCardProps {
  villager: SavedVillager
  totalCurrentVillagers?: number
}

function getDynamicIconSize(total: number = 1) {
  if (total > 8) return '36px'
  if (total > 5) return '42px'
  return '48px'
}

export function VillagerCard({ villager, totalCurrentVillagers = 1 }: VillagerCardProps) {
  const villagerName = villager.name.toLowerCase().replace(/\s+/g, '-')
  const iconSize = getDynamicIconSize(totalCurrentVillagers)
  const friendshipPoints = villager.friendshipPoints ?? 0

  const friendshipLevel = Math.max(1, Math.floor(friendshipPoints / 30) + 1)
  const displayedIconsCount = Math.min(friendshipLevel, 6)

  return (
    <div className="villager-card" style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem 1rem', alignItems: 'center', textAlign: 'center' }}>
      <Link 
        to={`/villagers/${villagerName}/interact`} 
        className="villager-info" 
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}
      >
        <img 
          src={villager.imageUrl || villager.icon} 
          alt={villager.name}
          style={{ width: iconSize, height: iconSize, borderRadius: '50%', objectFit: 'cover', transition: 'width 0.2s, height 0.2s' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.hasFailed) {
              target.dataset.hasFailed = 'true';
              target.src = '/path/to/local/fallback-avatar.png';
            }
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>{villager.name}</h4>
          <span className="species" style={{ fontSize: '0.75rem', color: '#7A756C' }}>{villager.species}</span>
        </div>
      </Link>

      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: '0.5rem', 
          paddingTop: '0.4rem', 
          borderTop: '1px solid #EAF3EC',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'center', flexWrap: 'wrap' }} title={`Level ${friendshipLevel} (${friendshipPoints} pts)`}>
          {Array.from({ length: displayedIconsCount }).map((_, index) => (
            <img 
              key={index}
              src="https://dodo.ac/np/images/4/4e/Katrina_NH_Character_Icon.png" 
              alt="Katrina Icon" 
              style={{ width: '18px', height: '18px', borderRadius: '50%' }} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}