export type VillagerCategory = 'CURRENT' | 'HISTORICAL' | 'DESIRED'

export interface Villager {
  id: string
  name: string
  species: string
  styles: string[]
  colors: string[]
  friendshipPoints: number
  icon: string
  category: VillagerCategory
}

export interface SavedVillager {
  id: string
  name: string
  species: string
  icon: string
  category: VillagerCategory
  friendshipPoints?: number
  styles?: string[]
  colors?: string[]
}

export interface InteractionPayload {
  action: 'TALK' | 'GIFT' | 'MAIL' | 'COMPLAINT'
  clothingId?: number
  pointsToAdd?: number
  wrapped?: boolean
  wrapColor?: string
}

export interface ChatLogEntry {
  id: string
  sender: 'user' | 'system'
  text: string
  timestamp: string
  pointsDelta?: number
}