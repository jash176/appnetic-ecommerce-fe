import { create } from 'zustand';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface CartState {
  items: Product[];
  addItem: (product: Omit<Product, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If product exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { items: updatedItems };
      } else {
        // Add new product to cart
        return { items: [...state.items, { ...product, quantity }] };
      }
    });
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      return { items: updatedItems };
    });
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
})); 