import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for favorites
const FAVORITES_KEY = 'user_favorites';

export interface FavoriteProduct {
  productId: number;
  productTitle: string;
  price: number;
  image?: string | null;
  addedAt: number; // timestamp
}

interface FavoritesState {
  favorites: FavoriteProduct[];
  isLoading: boolean;
  
  // Actions
  addFavorite: (product: Omit<FavoriteProduct, 'addedAt'>) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  loadFavorites: () => Promise<void>;
  saveFavorites: () => Promise<void>;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  
  loadFavorites: async () => {
    try {
      set({ isLoading: true });
      
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load favorites', error);
      set({ isLoading: false });
    }
  },
  
  saveFavorites: async () => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(get().favorites));
    } catch (error) {
      console.error('Failed to save favorites', error);
    }
  },
  
  addFavorite: (product) => {
    set((state) => {
      // Check if already in favorites
      if (state.favorites.some(item => item.productId === product.productId)) {
        return state;
      }
      
      // Add to favorites with timestamp
      const updatedFavorites = [
        ...state.favorites,
        { ...product, addedAt: Date.now() }
      ];
      
      // Save to AsyncStorage
      setTimeout(() => get().saveFavorites(), 0);
      
      return { favorites: updatedFavorites };
    });
  },
  
  removeFavorite: (productId) => {
    set((state) => {
      const updatedFavorites = state.favorites.filter(
        item => item.productId !== productId
      );
      
      // Save to AsyncStorage
      setTimeout(() => get().saveFavorites(), 0);
      
      return { favorites: updatedFavorites };
    });
  },
  
  isFavorite: (productId) => {
    return get().favorites.some(item => item.productId === productId);
  },
  
  clearFavorites: () => {
    set({ favorites: [] });
    AsyncStorage.removeItem(FAVORITES_KEY);
  }
})); 