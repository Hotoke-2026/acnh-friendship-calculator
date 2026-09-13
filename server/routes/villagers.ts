import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import * as db from '../db/villagers'
import request from 'superagent'

const router = express.Router()

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://api.animalfriendship.com',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://hotoke2026-levi.au.auth0.com/',
  tokenSigningAlg: 'RS256',
})

router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload.sub as string
    res.json(await db.getVillagersByUserId(userId))
  } catch {
    res.status(500).json({ message: 'Error fetching villagers' })
  }
})

router.get('/search', checkJwt, async (req, res) => {
  try {
    const nameQuery = req.query.name as string
    if (!nameQuery) {
      return res.status(400).json({ message: 'Name query parameter is required' })
    }

    const response = await request
      .get('https://api.nookipedia.com/villagers')
      .query({ 
        name: nameQuery,
        nhdetails: 'true' 
      })
      .set('X-API-KEY', process.env.NOOKIPEDIA_API_KEY || '')
      .set('Accept-Version', '1.0.0')

    res.json(response.body)
  } catch (err) {
    console.error('Error searching Nookipedia API:', err)
    res.status(500).json({ message: 'Error searching for villagers' })
  }
})

// Route for individual villager gift options page
router.get('/:id/gift-options', checkJwt, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = req.auth?.payload.sub as string

    const options = await db.getRankedGiftOptionsForVillager(id, userId)
    if (!options || !options.villager) {
      return res.status(404).json({ message: 'Villager not found' })
    }

    res.json(options)
  } catch (err) {
    console.error('Error fetching gift options:', err)
    res.status(500).json({ message: 'Error fetching gift options' })
  }
})

router.post('/:id/interact', checkJwt, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = req.auth?.payload.sub as string
    const updated = await db.updateVillagerPoints(id, userId, req.body)
    res.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    res.status(message === 'Villager not found' ? 404 : 500).json({ message: message || 'Error processing interaction' })
  }
})

router.put('/:id/save-points', checkJwt, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const userId = req.auth?.payload.sub as string
    const friendshipPoints = Number(req.body.friendshipPoints)

    if (!Number.isFinite(friendshipPoints)) {
      return res.status(400).json({ message: 'friendshipPoints must be a number' })
    }

    res.json(await db.savePoints(id, userId, friendshipPoints))
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    res.status(message === 'Villager not found' ? 404 : 500).json({
      message: message || 'Error saving friendship points',
    })
  }
})

export default router