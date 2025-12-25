export interface Property {
  id: string;
  address: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms?: number; // Optional as it's not always in the feed
  area: number; // in square feet or meters
  description: string;
  images: string[];
  coordinates: {
    lat: number;
    lon: number;
  };
  isFavorite: boolean;
  isHidden: boolean;
}