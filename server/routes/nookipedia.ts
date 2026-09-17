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
  const nameQuery = (req.query.name as string || '').toLowerCase()

  // Temporary mock placeholder data until you get your API key tomorrow
  const mockVillagers = [
    {
      name: 'Muffy',
      species: 'Sheep',
      nh_details: {
        icon_url: 'https://dodo.ac/np/images/7/73/Muffy_NH_Villager_Icon.png',
      },
    },
    {
      name: 'Bruce',
      species: 'Deer',
      nh_details: {
        icon_url: 'https://dodo.ac/np/images/9/9b/Bruce_NH_Villager_Icon.png',
      },
    },
    {
      name: 'Teddy',
      species: 'Bear',
      nh_details: {
        icon_url: 'https://dodo.ac/np/images/b/bd/Teddy_NH_Villager_Icon.png',
      },
    },
    {
      name: 'Coco',
      species: 'Rabbit',
      nh_details: {
        icon_url: 'https://dodo.ac/np/images/a/a2/Coco_NH_Villager_Icon.png',
      },
    },
  ]

  const filtered = mockVillagers.filter((v) =>
    v.name.toLowerCase().includes(nameQuery)
  )

  return res.json(filtered)
})

export default router