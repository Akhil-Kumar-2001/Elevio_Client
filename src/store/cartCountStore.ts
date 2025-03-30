// store/cartStore.ts
import { create } from 'zustand';

interface CartState {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void; // New decrement function
}

export const useCartCountStore = create<CartState>((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCartCount: () => set((state) => ({ 
    cartCount: state.cartCount > 0 ? state.cartCount - 1 : 0 // Prevent negative count
  })),
}));