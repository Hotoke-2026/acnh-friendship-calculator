import db from './connection'

interface VillagerRow {
  id: number
  user_id: string
  name: string
  species: any
  friendship_points: number
  imageUrl?: string
  color1?: any
  color2?: any
  style1?: string
  style2?: string
  is_last_moved_in?: number | boolean
  is_last_asked_to_stay?: number | boolean
  is_house_relocating?: number | boolean
}

interface ClothingRow {
  id: number
  name: string
  category: string
  color1: string
  color2?: string
  style1: string
  style2?: string
  sell_value: number
}

function toVillager(row: VillagerRow) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    species: row.species,
    friendshipPoints: row.friendship_points,
    imageUrl: row.imageUrl,
    styles: [row.style1, row.style2].filter(Boolean),
    colors: [row.color1, row.color2].filter(Boolean),
    isLastMovedIn: Boolean(row.is_last_moved_in),
    isLastAskedToStay: Boolean(row.is_last_asked_to_stay),
    isHouseRelocating: Boolean(row.is_house_relocating),
  }
}

export async function getVillagersByUserId(userId: string) {
  const villagers = await db('villagers').select('*').where('user_id', userId)
  return villagers.map(toVillager)
}

export async function updatePoints(id: number, userId: string, delta: number) {
  const villager = await db('villagers')
    .where({ id, user_id: userId })
    .first()

  if (!villager) throw new Error('Villager not found')

  const friendshipPoints = Math.max(0, Math.min(255, (villager.friendship_points || 0) + delta))
  await db('villagers').where({ id, user_id: userId }).update({ friendship_points: friendshipPoints })
  return toVillager({ ...villager, friendship_points: friendshipPoints })
}

export async function savePoints(id: number, userId: string, friendshipPoints: number) {
  const villager = await db('villagers')
    .where({ id, user_id: userId })
    .first()

  if (!villager) throw new Error('Villager not found')

  const points = Math.max(0, Math.min(255, Math.trunc(friendshipPoints)))
  await db('villagers').where({ id, user_id: userId }).update({ friendship_points: points })
  return toVillager({ ...villager, friendship_points: points })
}

export async function updateVillagerPoints(
  id: number,
  userId: string,
  interaction: {
    action: string
    subAction?: string
    clothingId?: number
    sellValue?: number
    isWrapped?: boolean
    wrapped?: boolean
    isTrash?: boolean
  }
) {
  let delta = 0
  switch (interaction.action) {
    case 'TALK':
    case 'MAIL':
      delta = 1
      break
    case 'INVITE_OVER':
    case 'VISIT_HOME':
      delta = interaction.subAction === 'PLAY_GAME' ? 2 : 1
      break
    case 'FAVOR':
      delta = interaction.subAction === 'COMPLETE' ? 3 : -1
      break
    case 'GREETING':
      delta = 3
      break
    case 'PUSH':
    case 'NET':
      delta = interaction.subAction === 'APOLOGY' ? 0 : -3
      break
    case 'GIFT':
    if (interaction.isTrash) delta = -2
    else if (interaction.clothingId) delta = await calculateClothingGiftPoints(id, interaction.clothingId)
    else if (interaction.sellValue !== undefined) delta = interaction.sellValue >= 750 ? 3 : 1
    if (interaction.isWrapped || interaction.wrapped) delta += 1
      break
  }
  return updatePoints(id, userId, delta)
}

export async function getRankedGiftOptionsForVillager(villagerId: number, userId: string) {
  const villager = await db('villagers')
  .select('*')
  .where({ id: villagerId, user_id: userId })
  .first()

  if (!villager) return null

  const userClothes = await db('user_clothes')
    .join('clothes', 'user_clothes.clothing_id', 'clothes.id')
    .where('user_clothes.user_id', userId)

  const tieredGifts: Record<number, ClothingRow[]> = { 4: [], 3: [], 2: [], 1: [] }

  userClothes.forEach((item) => {
    let points = 1
    const matchesStyle =
      [item.style1, item.style2].includes(villager.style1) ||
      [item.style1, item.style2].includes(villager.style2)
    const matchesColor =
      [item.color1, item.color2].includes(villager.color1) ||
      [item.color1, item.color2].includes(villager.color2)

    if (matchesStyle && matchesColor) points += 2
    else if (matchesStyle || matchesColor) points += 1

    if (item.sell_value >= 750) points += 1

    if (!tieredGifts[points]) tieredGifts[points] = []
    tieredGifts[points].push(item)
  })

  return { villager, tieredGifts }
}

export async function calculateClothingGiftPoints(_villagerId: number, clothingId: number) {
  const clothing = await db('clothes').where('id', clothingId).first()
  if (!clothing) return 0
  if (clothing.sell_value >= 750) return 3
  return 1
}

