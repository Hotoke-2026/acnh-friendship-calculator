import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import db from '../connection'
import { savePoints, updateVillagerPoints } from '../villagers'

describe('Villager DB Operations', () => {
  beforeEach(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
    await db('users').insert({ id: 'user|123', email: 'test@example.com' })
    await db('villagers').insert({
      id: 1,
      user_id: 'user|123',
      name: 'Raymond',
      friendship_points: 25,
    })
  })

  afterAll(async () => {
    await db.destroy()
  })

  it('adds 1 point for talking', async () => {
    const updated = await updateVillagerPoints(1, 'user|123', { action: 'TALK' })
    expect(updated.friendshipPoints).toBe(26)
  })

  it('adds 4 points for a high-value wrapped gift (+3 value, +1 wrapping)', async () => {
    const updated = await updateVillagerPoints(1, 'user|123', {
      action: 'GIFT',
      sellValue: 800,
      isWrapped: true,
    })
    expect(updated.friendshipPoints).toBe(29)
  })

  it('deducts 2 points for garbage', async () => {
    const updated = await updateVillagerPoints(1, 'user|123', {
      action: 'GIFT',
      isTrash: true,
    })
    expect(updated.friendshipPoints).toBe(23)
  })

  it('clamps saved friendship points to the valid range', async () => {
    const updated = await savePoints(1, 'user|123', 999)
    expect(updated.friendshipPoints).toBe(255)

    const lowered = await savePoints(1, 'user|123', -10)
    expect(lowered.friendshipPoints).toBe(0)
  })
})