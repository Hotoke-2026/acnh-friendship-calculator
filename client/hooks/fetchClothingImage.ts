const NOOKIPEDIA_API_KEY = import.meta.env.VITE_NOOKIPEDIA_API_KEY;

export interface NookipediaClothingItem {
  name: string;
  category: string;
  styles: string[];
  labelThemes: string[];
  imageUrl: string;
  variations: Array<{
    variation: string;
    color1: string;
    color2: string;
    image_url: string;
  }>;
}

export async function fetchAllClothing(): Promise<NookipediaClothingItem[]> {
  if (!NOOKIPEDIA_API_KEY) {
    throw new Error('VITE_NOOKIPEDIA_API_KEY is not defined in your environment variables.');
  }

  const response = await fetch('https://api.nookipedia.com/nh/clothing', {
    headers: {
      'X-API-KEY': NOOKIPEDIA_API_KEY,
      'Accept-Version': '1.0.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch clothing: ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((item: any) => ({
    name: item.name,
    category: item.category,
    styles: item.styles || [],
    labelThemes: item.label_themes || [],
    // Extract the primary icon from the first variation
    imageUrl: item.variations?.[0]?.image_url || '',
    variations: item.variations || [],
  }));
}