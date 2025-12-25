import type { Property } from '../types/property';

interface Yad2Item {
  id: number;
  price: number;
  token: string;
  address: {
    city: { text: string };
    street: { text: string };
    neighborhood: { text: string };
    coords: { lat: number; lon: number };
  };
  metaData: {
    coverImage: string;
    images: string[];
  };
  additionalDetails: {
    roomsCount: number;
    squareMeter: number;
    property: { text: string };
  };
}

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    // Using the proxy configured in vite.config.ts
    // Original URL: https://gw.yad2.co.il/realestate-feed/forsale/map?area=3&topArea=2&maxPrice=2000000&imageOnly=1&priceOnly=1&zoom=11
    // Proxy URL: /api/feed/forsale/map...
    const response = await fetch('/api/feed/forsale/map?area=3&topArea=2&maxPrice=2000000&imageOnly=1&priceOnly=1&zoom=11');

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Full API Response:', data);

    // Handle potential structure variations
    // Browser might receive { data: { markers: [...] } } or { data: { feed: { items: [...] } } }
    const feedData = data?.data?.feed || data?.feed;
    const items: Yad2Item[] =
      data?.data?.markers ||
      data?.markers ||
      feedData?.items ||
      [];

    return items.map((item) => {
      // Construct a readable address
      const street = item.address?.street?.text || '';
      const city = item.address?.city?.text || '';
      const neighborhood = item.address?.neighborhood?.text || '';
      const fullAddress = [street, neighborhood, city].filter(Boolean).join(', ');

      return {
        id: item.token || String(item.id),
        address: fullAddress,
        price: item.price,
        imageUrl: item.metaData?.coverImage || 'https://via.placeholder.com/300x200?text=No+Image',
        // Fallback to cover image if images array is empty or undefined
        images: item.metaData?.images?.length ? item.metaData.images : [item.metaData?.coverImage || 'https://via.placeholder.com/300x200?text=No+Image'],
        coordinates: {
          lat: item.address?.coords?.lat || 32.0853, // Default to generic TLV if missing
          lon: item.address?.coords?.lon || 34.7818
        },
        bedrooms: item.additionalDetails?.roomsCount || 0,
        area: item.additionalDetails?.squareMeter || 0,
        description: item.additionalDetails?.property?.text || 'נכס למכירה',
        isFavorite: false,
        isHidden: false,
      };
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Return empty array or throw, depending on app handling. 
    // For now, let's return a basic empty array so the app doesn't crash on boot if the proxy fails.
    // Ideally, we'd want to propagate the error or show a toast.
    throw error;
  }
};
