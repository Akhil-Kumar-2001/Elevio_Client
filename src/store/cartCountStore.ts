import { create } from 'zustand';

interface CartState {
  cartCount: number;
  wishlistCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  setWishlistCount: (count: number) => void;
  incrementWishlistCount: () => void;
  decrementWishlistCount: () => void;
}

export const useCartCountStore = create<CartState>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCartCount: () => set((state) => ({
    cartCount: state.cartCount > 0 ? state.cartCount - 1 : 0,
  })),
  setWishlistCount: (count) => set({ wishlistCount: count }),
  incrementWishlistCount: () => set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
  decrementWishlistCount: () => set((state) => ({
    wishlistCount: state.wishlistCount > 0 ? state.wishlistCount - 1 : 0,
  })),
}));