import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for cart data
const CART_ITEMS_KEY = 'cart_items';

export interface Product {
  productId: number;         // payload Product _id
  productTitle: string;      // for display in cart screen
  variant?: string;          // optional variant info (like size/color)
  quantity: number;
  price: number;             // final price after any discount
  image?: string | null;     // main product image URL for display
}

interface CartState {
  items: Product[];
  addItem: (product: Omit<Product, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  loadCart: () => Promise<void>;
  saveCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  loadCart: async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_ITEMS_KEY);
      if (cartData) {
        set({ items: JSON.parse(cartData) });
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  },
  
  saveCart: async () => {
    try {
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(get().items));
    } catch (error) {
      console.error('Failed to save cart to storage', error);
    }
  },
  
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(item => item.productId === product.productId);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // If product exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        updatedItems = [...state.items, { ...product, quantity }];
      }
      
      // Save updated cart to AsyncStorage
      setTimeout(() => get().saveCart(), 0);
      
      return { items: updatedItems };
    });
  },
  
  removeItem: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter(item => item.productId !== productId);
      
      // Save updated cart to AsyncStorage
      setTimeout(() => get().saveCart(), 0);
      
      return { items: updatedItems };
    });
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
      
      // Save updated cart to AsyncStorage
      setTimeout(() => get().saveCart(), 0);
      
      return { items: updatedItems };
    });
  },
  
  clearCart: () => {
    set({ items: [] });
    // Clear cart in AsyncStorage
    AsyncStorage.removeItem(CART_ITEMS_KEY);
  },
  
  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
})); 