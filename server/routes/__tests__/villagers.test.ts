import { beforeEach, describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import router from '../villagers'
import * as db from '../../db/villagers'

// Mock Auth0 middleware
vi.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (req: Request & { auth?: unknown }, _res: Response, next: NextFunction) => {
    req.auth = {
      header: { alg: 'RS256', typ: 'JWT' },
      token: 'mock-token',
      payload: { sub: 'user|123' },
    }
    next()
  },
}))

// Mock DB module
vi.mock('../../db/villagers')

const app = express()
app.use(express.json())
app.use('/api/v1/villagers', router)

describe('Villagers API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/villagers returns villager list', async () => {
    vi.mocked(db.getVillagersByUserId).mockResolvedValue([
      { id: 1, userId: 'user|123', name: 'Marshal', friendshipPoints: 100, isLastMovedIn: false, isLastAskedToStay: false, isHouseRelocating: false }
    ])

    const res = await request(app).get('/api/v1/villagers')
    expect(res.status).toBe(200)
    expect(res.body[0].name).toBe('Marshal')
    expect(db.getVillagersByUserId).toHaveBeenCalledWith('user|123')
  })

  it('POST /api/v1/villagers/:id/interact updates points', async () => {
    vi.mocked(db.updateVillagerPoints).mockResolvedValue({
      id: 1, userId: 'user|123', name: 'Marshal', friendshipPoints: 101, isLastMovedIn: false, isLastAskedToStay: false, isHouseRelocating: false
    })

    const res = await request(app)
      .post('/api/v1/villagers/1/interact')
      .send({ action: 'TALK' })

    expect(res.status).toBe(200)
    expect(res.body.friendshipPoints).toBe(101)
    expect(db.updateVillagerPoints).toHaveBeenCalledWith(1, 'user|123', { action: 'TALK' })
  })

  it('PUT /api/v1/villagers/:id/save-points saves a valid score', async () => {
    vi.mocked(db.savePoints).mockResolvedValue({
      id: 1, userId: 'user|123', name: 'Marshal', friendshipPoints: 150, isLastMovedIn: false, isLastAskedToStay: false, isHouseRelocating: false,
    })

    const res = await request(app)
      .put('/api/v1/villagers/1/save-points')
      .send({ friendshipPoints: 150 })

    expect(res.status).toBe(200)
    expect(res.body.friendshipPoints).toBe(150)
    expect(db.savePoints).toHaveBeenCalledWith(1, 'user|123', 150)
  })

  it('rejects an invalid friendship score', async () => {
    const res = await request(app)
      .put('/api/v1/villagers/1/save-points')
      .send({ friendshipPoints: 'not-a-number' })

    expect(res.status).toBe(400)
  })

  it('returns not found when saving points for an unknown villager', async () => {
    vi.mocked(db.savePoints).mockRejectedValue(new Error('Villager not found'))

    const res = await request(app)
      .put('/api/v1/villagers/999/save-points')
      .send({ friendshipPoints: 150 })

    expect(res.status).toBe(404)
  })

  it('returns server error when an interaction fails unexpectedly', async () => {
    vi.mocked(db.updateVillagerPoints).mockRejectedValue(new Error('Database unavailable'))

    const res = await request(app)
      .post('/api/v1/villagers/1/interact')
      .send({ action: 'TALK' })

    expect(res.status).toBe(500)
  })

  it('returns server error when fetching villagers fails', async () => {
    vi.mocked(db.getVillagersByUserId).mockRejectedValue(new Error('Database unavailable'))

    const res = await request(app).get('/api/v1/villagers')

    expect(res.status).toBe(500)
  })
})