// src/store/cartStore.ts
import { CartItem } from '@/types/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  totalPrice: number;
  setCartItems: (items: CartItem[]) => void;
  decrementCartCount: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      cartCount: 0,
      totalPrice: 0,
      setCartItems: (items: CartItem[]) =>
        set({
          cartItems: items,
          cartCount: items.length,
          totalPrice: items.reduce((sum, item) => sum + item.price, 0),
        }),
      decrementCartCount: () => set((state) => ({ cartCount: state.cartCount - 1 })),
      clearCart: () => set({ cartItems: [], cartCount: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage', // Unique key for the storage (stored in localStorage)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage mechanism
    }
  )
);