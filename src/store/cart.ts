import { CartStore } from '@/types/cart';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      increaseItem: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        })),
      decreaseItem: (id) => {
        const target = get().items.find((i) => i.id === id);
        if (!target) return;
        if (target.quantity <= 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)),
          });
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
