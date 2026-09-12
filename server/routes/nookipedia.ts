import { Router } from 'express'

const router = Router()

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
          'X-API-KEY': apiKey,
          'Accept-Version': '1.0.0',
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Item not found' })
    }

    const data = await response.json()
    
    // Extract primary icon URL from the first variation
    const imageUrl = data.variations?.[0]?.image_url || data.image_url || ''

    return res.json({
      name: data.name,
      category: data.category,
      imageUrl,
      variations: data.variations || [],
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching clothing item' })
  }
})

export default router