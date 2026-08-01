"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistItem = { id: string; slug: string; name: string; image: string; price: number };

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) => {
          const exists = s.items.some((i) => i.id === item.id);
          return {
            items: exists
              ? s.items.filter((i) => i.id !== item.id)
              : [...s.items, item],
          };
        }),
      has: (id) => get().items.some((i) => i.id === id),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "yc-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);
