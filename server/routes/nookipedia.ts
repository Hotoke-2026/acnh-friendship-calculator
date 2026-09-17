import { Router } from 'express'
import request from 'superagent'
import { auth } from 'express-oauth2-jwt-bearer'

const router = Router()

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://api.animalfriendship.com',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://hotoke2026-levi.au.auth0.com/',
  tokenSigningAlg: 'RS256',
})

router.get('/search', checkJwt, async (req, res) => {
  try {
    const nameQuery = (req.query.name as string || '').toLowerCase().trim()
    if (!nameQuery) {
      return res.status(400).json({ message: 'Name query parameter is required' })
    }

    const response = await request
      .get('https://api.nookipedia.com/villagers')
      .query({ nhdetails: 'true' })
      .set('X-API-KEY', process.env.NOOKIPEDIA_API_KEY || '')
      .set('Accept-Version', '1.0.0')

    const allVillagers = Array.isArray(response.body) ? response.body : []

    const filtered = allVillagers.filter((v: any) => 
      v.name && v.name.toLowerCase().includes(nameQuery)
    )

    res.json(filtered)
  } catch (err: any) {
    console.error('Error searching Nookipedia API:', err)

    if (err.code === 'EAI_AGAIN' || err.syscall === 'getaddrinfo') {
      return res.status(503).json({ message: 'Network error: Unable to reach Nookipedia API' })
    }

    res.status(500).json({ message: 'Error searching for villagers' })
  }
})

router.get('/clothing/:name', async (req, res) => {
  const apiKey = process.env.NOOKIPEDIA_API_KEY
  if (!apiKey) {
    return res.status(503).json({ message: 'Nookipedia API is not configured' })
  }

  try {
    const response = await fetch(
      `https://api.nookipedia.com/nh/clothing/${encodeURIComponent(req.params.name)}`,
      {
        headers: {
          'X-API-KEY': process.env.NOOKIPEDIA_API_KEY as string,
          'Accept-Version': '1.0.0',
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Item not found' })
    }

    const data = await response.json()
    const imageUrl = data.variations?.[0]?.image_url || data.image_url || ''

    return res.json({
      name: data.name,
      category: data.category,
      imageUrl,
      variations: data.variations || [],
    })
  } catch (error) {
    if (error instanceof Error && error.cause && (error.cause as any).code === 'EAI_AGAIN') {
      return res.status(503).json({ message: `Network error: unable to reach Nookipedia API` })
    }
    
    return res.status(500).json({ message: 'Error fetching clothing item' })
  }
})

router.get('/villagers', async (req, res) => {
  const apiKey = process.env.NOOKIPEDIA_API_KEY
  if (!apiKey) {
    return res.status(503).json({ message: 'Nookipedia API is not configured' })
  }

  const nameQuery = req.query.name as string || ''

  try {
    const response = await fetch(
      `https://api.nookipedia.com/villagers?name=${encodeURIComponent(nameQuery)}`,
      {
        headers: {
          'X-API-KEY': apiKey,
          'Accept-Version': '1.0.0',
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching villagers from Nookipedia' })
    }

    const data = await response.json()
    return res.json(data)
  } catch (error) {
    if (error instanceof Error && error.cause && (error.cause as any).code === 'EAI_AGAIN') {
      return res.status(503).json({ message: `Network error: unable to reach Nookipedia API` })
    }
    return res.status(500).json({ message: 'Error searching for villagers' })
  }
})

export default router