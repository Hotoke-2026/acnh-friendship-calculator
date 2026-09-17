import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SavedVillager, InteractionPayload, ChatLogEntry } from '../components/models/villager'

interface ClothingItem {
  name: string
  category: string
  imageUrl: string
  matchType?: 'perfect' | 'good' | 'okay'
  matchDetails?: string
}

interface WrappingPaper {
  name: string
  color: string
  imageUrl: string
  singlePrice: number
  bundlePrice: number
  imageUrlPaper: string
}

const WRAPPING_PAPERS: WrappingPaper[] = [
  { name: 'Black Wrapping Paper', color: 'Black', imageUrl: 'https://dodo.ac/np/images/thumb/e/e4/Black_Wrapping_Paper_NH_Icon.png/60px-Black_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/e/e4/Black_Wrapping_Paper_NH_Icon.png/60px-Black_Wrapping_Paper_NH_Icon.png' },
  { name: 'Blue Wrapping Paper', color: 'Blue', imageUrl: 'https://dodo.ac/np/images/thumb/a/a2/Blue_Wrapping_Paper_NH_Icon.png/60px-Blue_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/a/a2/Blue_Wrapping_Paper_NH_Icon.png/60px-Blue_Wrapping_Paper_NH_Icon.png' },
  { name: 'Brown Wrapping Paper', color: 'Brown', imageUrl: 'https://dodo.ac/np/images/thumb/8/87/Brown_Wrapping_Paper_NH_Icon.png/60px-Brown_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/8/87/Brown_Wrapping_Paper_NH_Icon.png/60px-Brown_Wrapping_Paper_NH_Icon.png' },
  { name: 'Chartreuse Wrapping Paper', color: 'Chartreuse', imageUrl: 'https://dodo.ac/np/images/thumb/7/7b/Chartreuse_Wrapping_Paper_NH_Icon.png/60px-Chartreuse_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/7/7b/Chartreuse_Wrapping_Paper_NH_Icon.png/60px-Chartreuse_Wrapping_Paper_NH_Icon.png' },
  { name: 'Gold Wrapping Paper', color: 'Gold', imageUrl: 'https://dodo.ac/np/images/thumb/e/e4/Gold_Wrapping_Paper_NH_Icon.png/60px-Gold_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/e/e4/Gold_Wrapping_Paper_NH_Icon.png/60px-Gold_Wrapping_Paper_NH_Icon.png' },
  { name: 'Gray Wrapping Paper', color: 'Gray', imageUrl: 'https://dodo.ac/np/images/thumb/e/ee/Gray_Wrapping_Paper_NH_Icon.png/60px-Gray_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/e/ee/Gray_Wrapping_Paper_NH_Icon.png/60px-Gray_Wrapping_Paper_NH_Icon.png' },
  { name: 'Green Wrapping Paper', color: 'Green', imageUrl: 'https://cdn.nookazon.com/128x128/nookazon/MenuIcon/WPaperGreen.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://cdn.nookazon.com/128x128/nookazon/MenuIcon/WPaperGreen.png' },
  { name: 'Light-Blue Wrapping Paper', color: 'Light-Blue', imageUrl: 'https://dodo.ac/np/images/thumb/f/f6/Light-Blue_Wrapping_Paper_NH_Icon.png/60px-Light-Blue_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/f/f6/Light-Blue_Wrapping_Paper_NH_Icon.png/60px-Light-Blue_Wrapping_Paper_NH_Icon.png' },
  { name: 'Mint Wrapping Paper', color: 'Mint', imageUrl: 'https://dodo.ac/np/images/thumb/2/2f/Mint_Wrapping_Paper_NH_Icon.png/60px-Mint_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/2/2f/Mint_Wrapping_Paper_NH_Icon.png/60px-Mint_Wrapping_Paper_NH_Icon.png' },
  { name: 'Navy Wrapping Paper', color: 'Navy', imageUrl: 'https://dodo.ac/np/images/thumb/3/3f/Navy_Wrapping_Paper_NH_Icon.png/60px-Navy_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/3/3f/Navy_Wrapping_Paper_NH_Icon.png/60px-Navy_Wrapping_Paper_NH_Icon.png' },
  { name: 'Orange Wrapping Paper', color: 'Orange', imageUrl: 'https://dodo.ac/np/images/thumb/5/5a/Orange_Wrapping_Paper_NH_Icon.png/60px-Orange_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/5/5a/Orange_Wrapping_Paper_NH_Icon.png/60px-Orange_Wrapping_Paper_NH_Icon.png' },
  { name: 'Pink Wrapping Paper', color: 'Pink', imageUrl: 'https://dodo.ac/np/images/thumb/1/1a/Pink_Wrapping_Paper_NH_Icon.png/60px-Pink_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/1/1a/Pink_Wrapping_Paper_NH_Icon.png/60px-Pink_Wrapping_Paper_NH_Icon.png' },
  { name: 'Purple Wrapping Paper', color: 'Purple', imageUrl: 'https://dodo.ac/np/images/thumb/e/ed/Purple_Wrapping_Paper_NH_Icon.png/60px-Purple_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/e/ed/Purple_Wrapping_Paper_NH_Icon.png/60px-Purple_Wrapping_Paper_NH_Icon.png' },
  { name: 'Red Wrapping Paper', color: 'Red', imageUrl: 'https://dodo.ac/np/images/thumb/f/f0/Red_Wrapping_Paper_NH_Icon.png/60px-Red_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/f/f0/Red_Wrapping_Paper_NH_Icon.png/60px-Red_Wrapping_Paper_NH_Icon.png' },
  { name: 'White Wrapping Paper', color: 'White', imageUrl: 'https://dodo.ac/np/images/thumb/4/4b/White_Wrapping_Paper_NH_Icon.png/60px-White_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/4/4b/White_Wrapping_Paper_NH_Icon.png/60px-White_Wrapping_Paper_NH_Icon.png' },
  { name: 'Yellow Wrapping Paper', color: 'Yellow', imageUrl: 'https://dodo.ac/np/images/thumb/0/0c/Yellow_Wrapping_Paper_NH_Icon.png/60px-Yellow_Wrapping_Paper_NH_Icon.png', singlePrice: 160, bundlePrice: 800, imageUrlPaper: 'https://dodo.ac/np/images/thumb/0/0c/Yellow_Wrapping_Paper_NH_Icon.png/60px-Yellow_Wrapping_Paper_NH_Icon.png' },
]

export function VillagerInteractPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [villager, setVillager] = useState<SavedVillager | null>(null)
  
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>(() => {
    const savedLog = localStorage.getItem(`villager_chat_log_${id}`)
    if (savedLog) {
      try {
        return JSON.parse(savedLog)
      } catch (e) {
        console.error('Failed to parse chat log', e)
      }
    }
    return []
  })

  const [selectedLogIds, setSelectedLogIds] = useState<Record<string, boolean>>({})
  const [isInteracting, setIsInteracting] = useState(false)
  const [showApologyPopup, setShowApologyPopup] = useState(false)

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false)
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [isLoadingClothing, setIsLoadingClothing] = useState(false)
  const [isWrapped, setIsWrapped] = useState(true)
  const [selectedPaper, setSelectedPaper] = useState<WrappingPaper>(WRAPPING_PAPERS[13])
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)

  const [letterText, setLetterText] = useState('')
  const [attachGift, setAttachGift] = useState(false)
  const [letterGift, setLetterGift] = useState<ClothingItem | null>(null)

  const loadVillagers = () => {
    const saved = localStorage.getItem('user_saved_villagers')
    if (saved) {
      try {
        const villagersList: SavedVillager[] = JSON.parse(saved)
        const found = villagersList.find((v) => {
          const vId = v.id || v.name.toLowerCase().replace(/\s+/g, '-')
          return vId === id
        })
        if (found) {
          setVillager(found)
        }
        return villagersList
      } catch (err) {
        console.error('Failed to load villagers from storage', err)
      }
    }
    return []
  }

  useEffect(() => {
    loadVillagers()

    const handleFocus = () => loadVillagers()
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'user_saved_villagers') {
        loadVillagers()
      }
    }
    const handleCustomVillagerUpdate = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        const list: SavedVillager[] = Array.isArray(customEvent.detail) ? customEvent.detail : []
        const found = list.find((v) => {
          const vId = v.id || v.name.toLowerCase().replace(/\s+/g, '-')
          return vId === id
        })
        if (found) setVillager(found)
      } else {
        loadVillagers()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorage as EventListener)
    window.addEventListener('villagers_updated', handleCustomVillagerUpdate as EventListener)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorage as EventListener)
      window.removeEventListener('villagers_updated', handleCustomVillagerUpdate as EventListener)
    }
  }, [id])

  const updateVillagerStateAndStorage = (updatedVillager: SavedVillager) => {
    setVillager(updatedVillager)

    const saved = localStorage.getItem('user_saved_villagers')
    if (saved) {
      try {
        const villagersList: SavedVillager[] = JSON.parse(saved)
        const updatedList = villagersList.map((v) => {
          const vId = v.id || v.name.toLowerCase().replace(/\s+/g, '-')
          const targetId = updatedVillager.id || updatedVillager.name.toLowerCase().replace(/\s+/g, '-')
          return vId === targetId ? updatedVillager : v
        })
        localStorage.setItem('user_saved_villagers', JSON.stringify(updatedList))
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user_saved_villagers',
          newValue: JSON.stringify(updatedList)
        }))
        window.dispatchEvent(new CustomEvent('villagers_updated', { detail: updatedList }))
      } catch (err) {
        console.error('Failed to update storage', err)
      }
    }

    localStorage.setItem(`villager_chat_log_${updatedVillager.id}`, JSON.stringify(chatLog))
  }

  useEffect(() => {
    if (!villager) return
    localStorage.setItem(`villager_chat_log_${villager.id}`, JSON.stringify(chatLog))
  }, [chatLog, villager])

  const handlePaperChange = (paper: WrappingPaper) => {
    setSelectedPaper(paper)
    if (villager) {
      localStorage.setItem(`villager_wrap_${villager.id}`, paper.name)
    }
  }

  const getFallbackGifts = (): ClothingItem[] => [
    { name: 'Grand Piano', category: 'Furniture', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/e/e4/Black_Wrapping_Paper_NH_Icon.png/60px-Black_Wrapping_Paper_NH_Icon.png', matchType: 'perfect', matchDetails: `Style: ${villager?.styles?.[0] || 'Music'} • Colors: ${villager?.colors?.join(' & ') || 'Matching'}` },
    { name: 'Helicopter Toy', category: 'Misc', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/a/a2/Blue_Wrapping_Paper_NH_Icon.png/60px-Blue_Wrapping_Paper_NH_Icon.png', matchType: 'perfect', matchDetails: `Style: ${villager?.styles?.[1] || 'Hobby'} • Colors: ${villager?.colors?.join(' & ') || 'Matching'}` },
    { name: 'Iron Wall Lamp', category: 'Wall-mounted', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/8/87/Brown_Wrapping_Paper_NH_Icon.png/60px-Brown_Wrapping_Paper_NH_Icon.png', matchType: 'perfect', matchDetails: `Style: Industrial • Colors: ${villager?.colors?.join(' & ') || 'Matching'}` },
    { name: 'Terrarium', category: 'Housewares', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/7/7b/Chartreuse_Wrapping_Paper_NH_Icon.png/60px-Chartreuse_Wrapping_Paper_NH_Icon.png', matchType: 'perfect', matchDetails: `Style: Nature • Colors: ${villager?.colors?.join(' & ') || 'Matching'}` },
    { name: 'Royal Crown', category: 'Headwear', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/e/e4/Gold_Wrapping_Paper_NH_Icon.png/60px-Gold_Wrapping_Paper_NH_Icon.png', matchType: 'perfect', matchDetails: `Style: Gorgeous • Colors: ${villager?.colors?.join(' & ') || 'Matching'}` },
    { name: 'Simple Parka', category: 'Clothing', imageUrl: 'https://dodo.ac/np/images/thumb/8/82/Simple_Parka_%28Black%29_NH_Icon.png/60px-Simple_Parka_%28Black%29_NH_Icon.png', matchType: 'good', matchDetails: `Style: Simple • Color: ${villager?.colors?.[0] || 'Favorite 1'}` },
    { name: 'Tweed Vest', category: 'Clothing', imageUrl: 'https://dodo.ac/np/images/thumb/5/5a/Tweed_Vest_%28Brown%29_NH_Icon.png/60px-Tweed_Vest_%28Brown%29_NH_Icon.png', matchType: 'good', matchDetails: `Style: Formal • Color: ${villager?.colors?.[0] || 'Favorite 1'}` },
    { name: 'Throwback Skull Radio', category: 'Housewares', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/e/ee/Gray_Wrapping_Paper_NH_Icon.png/60px-Gray_Wrapping_Paper_NH_Icon.png', matchType: 'good', matchDetails: `Style: Quirky • Color: ${villager?.colors?.[1] || 'Favorite 2'}` },
    { name: 'Dolly', category: 'Housewares', imageUrl: 'https://cdn.nookazon.com/128x128/nookazon/MenuIcon/WPaperGreen.png', matchType: 'good', matchDetails: `Style: Cute • Color: ${villager?.colors?.[0] || 'Favorite 1'}` },
    { name: 'Cardboard Box', category: 'Misc', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/f/f6/Light-Blue_Wrapping_Paper_NH_Icon.png/60px-Light-Blue_Wrapping_Paper_NH_Icon.png', matchType: 'good', matchDetails: `Style: Basic • Color: ${villager?.colors?.[1] || 'Favorite 2'}` },
    { name: 'Standard Umbrella', category: 'Umbrellas', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/2/2f/Mint_Wrapping_Paper_NH_Icon.png/60px-Mint_Wrapping_Paper_NH_Icon.png', matchType: 'okay', matchDetails: 'Style: Neutral • Color: Unmatched' },
    { name: 'Fresh Fruit', category: 'Food/Fruit', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/3/3f/Navy_Wrapping_Paper_NH_Icon.png/60px-Navy_Wrapping_Paper_NH_Icon.png', matchType: 'okay', matchDetails: 'Style: Natural • Color: Unmatched' },
    { name: 'Clump of Weeds', category: 'Materials', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/5/5a/Orange_Wrapping_Paper_NH_Icon.png/60px-Orange_Wrapping_Paper_NH_Icon.png', matchType: 'okay', matchDetails: 'Style: None • Color: Unmatched' },
    { name: 'Tree Branch', category: 'Materials', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/1/1a/Pink_Wrapping_Paper_NH_Icon.png/60px-Pink_Wrapping_Paper_NH_Icon.png', matchType: 'okay', matchDetails: 'Style: None • Color: Unmatched' },
    { name: 'Sea Shell', category: 'Materials', imageUrl: selectedPaper?.imageUrl || 'https://dodo.ac/np/images/thumb/e/ed/Purple_Wrapping_Paper_NH_Icon.png/60px-Purple_Wrapping_Paper_NH_Icon.png', matchType: 'okay', matchDetails: 'Style: None • Color: Unmatched' },
  ]

  const fetchClothingOptions = async () => {
    setIsLoadingClothing(true)
    try {
      const res = await fetch(`/api/v1/nookipedia/clothing/shirt`)
      if (res.ok) {
        const data = await res.json()
        const variations = data.variations || []
        const mappedItems: ClothingItem[] = variations.slice(0, 15).map((v: any, index: number) => {
          let matchType: 'perfect' | 'good' | 'okay' = 'okay'
          let matchDetails = villager ? `Colors: ${villager.colors?.join(', ') || 'Custom'} • Styles: ${villager.styles?.join(', ') || 'Standard'}` : 'Standard match'
          if (index < 5) {
            matchType = 'perfect'
            matchDetails = `Style: ${villager?.styles?.[0] || 'Elegant'} • Colors: ${villager?.colors?.join(' & ') || 'Favorite 1 & 2'}`
          } else if (index < 10) {
            matchType = 'good'
            matchDetails = `Style: Casual • Color: ${villager?.colors?.[0] || 'Favorite 1'}`
          }

          return {
            name: `${data.name} (${v.color1 || 'Custom'})`,
            category: data.category || 'Clothing',
            imageUrl: v.image_url,
            matchType,
            matchDetails,
          }
        })
        setClothingItems(mappedItems.length > 0 ? mappedItems : getFallbackGifts())
      } else {
        setClothingItems(getFallbackGifts())
      }
    } catch {
      setClothingItems(getFallbackGifts())
    } finally {
      setIsLoadingClothing(false)
    }
  }

  const openGiftModal = async () => {
    setSelectedItem(null)
    setIsGiftModalOpen(true)
    await fetchClothingOptions()
  }

  const openLetterModal = async () => {
    setLetterText('')
    setAttachGift(false)
    setLetterGift(null)
    setIsLetterModalOpen(true)
    await fetchClothingOptions()
  }

  const handleGiveGift = (item: ClothingItem) => {
    if (!villager) return

    const wrapBonus = isWrapped ? 1 : 0
    let matchBonus = 1
    if (item.matchType === 'perfect') matchBonus = 3
    else if (item.matchType === 'good') matchBonus = 2

    const pointsDelta = matchBonus + wrapBonus
    const newPoints = Math.max(0, (villager.friendshipPoints ?? 0) + pointsDelta)
    const updatedVillager = { ...villager, friendshipPoints: newPoints }
    
    updateVillagerStateAndStorage(updatedVillager)

    const givesGiftBack = Math.random() > 0.3
    const returnGiftText = givesGiftBack 
      ? ` ${villager.name} is delighted and gives you a return gift in appreciation!` 
      : ` ${villager.name} smiles warmly, but doesn't hand back a return gift this time.`

    const matchLabel = item.matchType ? `${item.matchType} match` : 'gift'
    const message = `You gave ${item.name} (${matchLabel})${isWrapped ? ` wrapped in ${selectedPaper.name}` : ''} to ${villager.name}.${returnGiftText}`

    const newEntry: ChatLogEntry = {
      id: Date.now().toString(),
      sender: 'system',
      text: `${message} (+${pointsDelta} friendship points)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pointsDelta,
    }

    setChatLog((prev) => [...prev, newEntry])
    setIsGiftModalOpen(false)
    setSelectedItem(null)
  }

  const handleSendLetter = () => {
    if (!villager) return

    let pointsDelta = 0
    let giftText = ''

    if (attachGift && letterGift) {
      const wrapBonus = isWrapped ? 1 : 0
      let matchBonus = 1
      if (letterGift.matchType === 'perfect') matchBonus = 3
      else if (letterGift.matchType === 'good') matchBonus = 2
      pointsDelta = matchBonus + wrapBonus
      giftText = ` with an attached gift (${letterGift.name}${isWrapped ? ` wrapped in ${selectedPaper.name}` : ''})`
    }

    const newPoints = Math.max(0, (villager.friendshipPoints ?? 0) + pointsDelta)
    const updatedVillager = { ...villager, friendshipPoints: newPoints }
    
    updateVillagerStateAndStorage(updatedVillager)

    const message = `You mailed a letter to ${villager.name}${giftText}.`

    const newEntry: ChatLogEntry = {
      id: Date.now().toString(),
      sender: 'system',
      text: `${message} (${pointsDelta >= 0 ? `+${pointsDelta}` : pointsDelta} friendship points)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pointsDelta,
    }

    setChatLog((prev) => [...prev, newEntry])
    setIsLetterModalOpen(false)
    setLetterGift(null)
    setAttachGift(false)
  }

  const handleInteraction = async (action: InteractionPayload['action'] | 'HIT_NET' | 'PUSH' | 'APOLOGIZE') => {
    if (!villager) return

    if (action === 'MAIL') {
      openLetterModal()
      return
    }

    setIsInteracting(true)
    let pointsDelta = 0
    let message = ''

    switch (action) {
      case 'TALK':
        pointsDelta = 1
        message = `You talked to ${villager.name}. Quick chat earns 1 pt!`
        break
      case 'COMPLAINT':
        pointsDelta = 0
        message = `You filed a complaint about ${villager.name}. Resets clothes/catchphrases safely.`
        break
      case 'HIT_NET':
        pointsDelta = -3
        message = `You accidentally (or purposefully!) hit ${villager.name} with your net! They look furious and upset.`
        setShowApologyPopup(true)
        break
      case 'PUSH':
        pointsDelta = -2
        message = `You kept pushing ${villager.name} until they stamped their foot in anger!`
        setShowApologyPopup(true)
        break
      case 'APOLOGIZE':
        pointsDelta = 3
        message = `You sincerely apologized to ${villager.name}. They accepted your apology and forgave you!`
        setShowApologyPopup(false)
        break
    }

    const newPoints = Math.max(0, (villager.friendshipPoints ?? 0) + pointsDelta)
    const updatedVillager = { ...villager, friendshipPoints: newPoints }
    
    updateVillagerStateAndStorage(updatedVillager)

    const newEntry: ChatLogEntry = {
      id: Date.now().toString(),
      sender: 'system',
      text: `${message} (${pointsDelta >= 0 ? `+${pointsDelta}` : pointsDelta} friendship points)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pointsDelta,
    }

    setChatLog((prev) => [...prev, newEntry])
    setIsInteracting(false)
  }

  const toggleLogSelection = (id: string) => {
    setSelectedLogIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleRemoveSelectedLogs = () => {
    if (!villager) return

    let totalPointsToSubtract = 0
    chatLog.forEach(log => {
      if (selectedLogIds[log.id] && log.pointsDelta) {
        totalPointsToSubtract += log.pointsDelta
      }
    })

    const newPoints = Math.max(0, (villager.friendshipPoints ?? 0) - totalPointsToSubtract)
    const updatedVillager = { ...villager, friendshipPoints: newPoints }
    updateVillagerStateAndStorage(updatedVillager)

    setChatLog(prev => prev.filter(log => !selectedLogIds[log.id]))
    setSelectedLogIds({})
  }

  if (!villager) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: '#7A756C' }}>Villager not found.</p>
        <button onClick={() => navigate('/')} className="logout-btn" style={{ width: 'auto', marginTop: '1rem' }}>
          ← Back Home
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/')}
          className="logout-btn"
          style={{ width: 'auto', borderRadius: '12px', padding: '0 0.75rem', fontSize: '0.8rem', height: '32px' }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#2D2B2A' }}>Interact with {villager.name}</h2>
        <div style={{ width: '50px' }} />
      </div>

      <div className="summary-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
        <img src={villager.icon} alt={villager.name} style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2D2B2A' }}>{villager.name}</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#7A756C' }}>
            {villager.species} {villager.colors && villager.colors.length > 0 && `• Colors: ${villager.colors.join(', ')}`} {villager.styles && villager.styles.length > 0 && `• Styles: ${villager.styles.join(', ')}`}
          </p>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#E87A5D' }}>
          ❤️ {villager.friendshipPoints ?? 0} pts
        </div>
      </div>

      <div className="summary-card" style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2D2B2A' }}>🎁 Preferred Gift Wrapping</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <img src={selectedPaper.imageUrlPaper} alt={selectedPaper.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '0.75rem', color: '#7A756C' }}>Paper:</span>
          </div>
          <select 
            value={selectedPaper.name} 
            onChange={(e) => {
              const foundPaper = WRAPPING_PAPERS.find(p => p.name === e.target.value)
              if (foundPaper) handlePaperChange(foundPaper)
            }}
            style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #CCC', fontSize: '0.75rem', flex: 1 }}
          >
            {WRAPPING_PAPERS.map((paper) => (
              <option key={paper.name} value={paper.name}>
                {paper.name} ({paper.singlePrice} Bells single / {paper.bundlePrice} Bells bundle)
              </option>
            ))}
          </select>
          <img src="https://dodo.ac/np/images/0/0d/Bell_CF_Icon_L.png" alt="Bell Icon" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          disabled={isInteracting}
          onClick={() => handleInteraction('TALK')}
          style={{ padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#2D4B43', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💬 Talk Today (+1 pt)
        </button>
        <button
          disabled={isInteracting}
          onClick={openGiftModal}
          style={{ padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#E87A5D', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🎁 Give a Gift (+1 to +3 pts)
        </button>
        <button
          disabled={isInteracting}
          onClick={() => handleInteraction('MAIL')}
          style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #CCC', backgroundColor: '#FAF7F2', fontWeight: 'bold', cursor: 'pointer', color: '#2D2B2A' }}
        >
          ✉️ Send Letter (0 pts)
        </button>
        <button
          disabled={isInteracting}
          onClick={() => handleInteraction('HIT_NET')}
          style={{ padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#C0392B', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🥅 Hit with Net (-3 pts)
        </button>
        <button
          disabled={isInteracting}
          onClick={() => handleInteraction('PUSH')}
          style={{ padding: '0.75rem', borderRadius: '10px', border: 'none', backgroundColor: '#D35400', color: '#FFF', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💢 Push Around (-2 pts)
        </button>

        {showApologyPopup && (
          <button
            disabled={isInteracting}
            onClick={() => handleInteraction('APOLOGIZE')}
            style={{ 
              padding: '0.75rem', 
              borderRadius: '10px', 
              border: '2px dashed #27AE60', 
              backgroundColor: '#EAF9F0', 
              color: '#27AE60', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              animation: 'pulse 1.5s infinite'
            }}
          >
            🙏 Apologize to Earn Points Back (+3 pts)
          </button>
        )}

        <button
          disabled={isInteracting}
          onClick={() => handleInteraction('COMPLAINT')}
          style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #CCC', backgroundColor: '#FAF7F2', fontWeight: 'bold', cursor: 'pointer', color: '#2D2B2A' }}
        >
          ⚠️ File Complaint (0 pts)
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', color: '#7A756C', margin: 0 }}>Interaction History</h4>
        {Object.values(selectedLogIds).some(Boolean) && (
          <button
            onClick={handleRemoveSelectedLogs}
            style={{
              background: 'none',
              border: 'none',
              color: '#D85A5D',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: 0
            }}
          >
            🗑️ Remove Checked
          </button>
        )}
      </div>

      <div className="summary-card" style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#FAF7F2', marginBottom: '1rem' }}>
        {chatLog.map((log) => (
          <div key={log.id} style={{ fontSize: '0.8rem', borderBottom: '1px solid #EEE', paddingBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={!!selectedLogIds[log.id]}
              onChange={() => toggleLogSelection(log.id)}
              style={{ marginTop: '0.2rem', cursor: 'pointer', width: '16px', height: '16px' }}
              title="Check to remove message"
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A09B90', fontSize: '0.7rem', marginBottom: '0.1rem' }}>
                <span>Island Event</span>
                <span>{log.timestamp}</span>
              </div>
              <p style={{ margin: 0, color: '#2D2B2A' }}>{log.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4A7C59', fontWeight: 'bold', marginBottom: '1rem' }}>
        ✓ Changes saved automatically
      </div>

      {isGiftModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="summary-card" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFF', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Choose Gift for {villager.name}</h3>
              <button onClick={() => setIsGiftModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#7A756C' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={selectedPaper.imageUrlPaper} alt={selectedPaper.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2D2B2A' }}>Wrap Gift ({selectedPaper.name}) (+1 Bonus Pt)</span>
              </div>
              <input 
                type="checkbox" 
                checked={isWrapped} 
                onChange={(e) => setIsWrapped(e.target.checked)} 
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
            </div>

            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 'bold', color: '#7A756C' }}>Gift Options with Style & Color Matches:</p>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {isLoadingClothing ? (
                <p style={{ textAlign: 'center', color: '#7A756C', fontSize: '0.85rem', padding: '1rem' }}>Loading gift recommendations...</p>
              ) : clothingItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#7A756C', fontSize: '0.85rem', padding: '1rem' }}>No gift recommendations found.</p>
              ) : (
                clothingItems.map((item, idx) => {
                  const isSelected = selectedItem?.name === item.name

                  let badgeBg = '#EAF3EC'
                  let badgeColor = '#2D4B43'
                  let badgeText = '★ Perfect (+3)'
                  if (item.matchType === 'good') {
                    badgeBg = '#FFF3E0'
                    badgeColor = '#D87A2A'
                    badgeText = '✓ Good (+2)'
                  } else if (item.matchType === 'okay') {
                    badgeBg = '#F0F0F0'
                    badgeColor = '#7A756C'
                    badgeText = '• Okay (+1)'
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedItem(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#EBF3F0' : '#FAF7F2',
                        border: isSelected ? '2px solid #2D4B43' : '1px solid #E5E0D8',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img src={item.imageUrl} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '0.85rem', color: '#2D2B2A' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.65rem', color: '#7A756C', marginTop: '0.1rem' }}>{item.matchDetails}</div>
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '6px', 
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        whiteSpace: 'nowrap'
                      }}>
                        {badgeText}
                      </span>
                    </div>
                  )
                })
              )}
            </div>

            {selectedItem && (
              <button
                onClick={() => handleGiveGift(selectedItem)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#E87A5D',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                🎁 Gift "{selectedItem.name}"
              </button>
            )}
          </div>
        </div>
      )}

      {isLetterModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="summary-card" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#FFF', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Write Letter to {villager.name}</h3>
              <button onClick={() => setIsLetterModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#7A756C' }}>✕</button>
            </div>

            <textarea
              placeholder={`Write your message to ${villager.name}...`}
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #CCC', fontSize: '0.85rem', marginBottom: '1rem', resize: 'vertical' }}
            />

            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2D2B2A' }}>🎁 Attach a Gift to Letter</span>
              </div>
              <input 
                type="checkbox" 
                checked={attachGift} 
                onChange={(e) => {
                  setAttachGift(e.target.checked)
                  if (!e.target.checked) setLetterGift(null)
                }} 
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
            </div>

            {attachGift && (
              <>
                <div style={{ backgroundColor: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <img src={selectedPaper.imageUrlPaper} alt={selectedPaper.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.75rem', color: '#7A756C' }}>Wrap Gift:</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isWrapped} 
                    onChange={(e) => setIsWrapped(e.target.checked)} 
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </div>

                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 'bold', color: '#7A756C' }}>Select Gift Item to Attach:</p>
                <div style={{ overflowY: 'auto', maxHeight: '160px', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {isLoadingClothing ? (
                    <p style={{ textAlign: 'center', color: '#7A756C', fontSize: '0.8rem', padding: '0.5rem' }}>Loading items...</p>
                  ) : (
                    clothingItems.map((item, idx) => {
                      const isSelected = letterGift?.name === item.name
                      return (
                        <div
                          key={idx}
                          onClick={() => setLetterGift(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#EBF3F0' : '#FAF7F2',
                            border: isSelected ? '2px solid #2D4B43' : '1px solid #E5E0D8'
                          }}
                        >
                          <img src={item.imageUrl} alt={item.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '0.8rem', color: '#2D2B2A' }}>{item.name}</strong>
                          </div>
                          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: item.matchType === 'perfect' ? '#2D4B43' : '#7A756C' }}>
                            {item.matchType}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleSendLetter}
              disabled={attachGift && !letterGift}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: (attachGift && !letterGift) ? '#CCC' : '#2D4B43',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: (attachGift && !letterGift) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ✉️ Send Letter {attachGift && letterGift ? `with ${letterGift.name}` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}