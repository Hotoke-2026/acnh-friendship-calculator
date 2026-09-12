import db from './connection'

export async function getBestRecipientsForClothing(clothingId: number, userId: string) {
  const item = await db('clothes').where('id', clothingId).first()
  const villagers = await db('villagers').where('user_id', userId)

  return villagers.map((villager) => {
    let score = 0

    // Match Styles (+2 points per match)
    if ([item.style1, item.style2].includes(villager.style1)) score += 2
    if (item.style2 && [item.style1, item.style2].includes(villager.style2)) score += 2

    // Match Colors (+1 point per match)
    if ([item.color1, item.color2].includes(villager.color1)) score += 1
    if (item.color2 && [item.color1, item.color2].includes(villager.color2)) score += 1

    return {
      villagerId: villager.id,
      name: villager.name,
      matchScore: score,
      recommendation: score >= 4 ? 'Best Match!' : score >= 2 ? 'Good Match' : 'Neutral'
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}