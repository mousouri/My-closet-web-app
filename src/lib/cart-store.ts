"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;        // product id
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: string, size?: string, color?: string) => void;
  updateQty: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clear: () => void;
};

const sameLine = (a: CartItem, b: { id: string; size?: string; color?: string }) =>
  a.id === b.id && (a.size ?? "") === (b.size ?? "") && (a.color ?? "") === (b.color ?? "");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      add: (item, quantity = 1) =>
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, item));
          if (existing) {
            return {
              items: s.items.map((i) =>
                sameLine(i, item) ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...s.items, { ...item, quantity }], isOpen: true };
        }),
      remove: (id, size, color) =>
        set((s) => ({
          items: s.items.filter((i) => !(sameLine(i, { id, size, color }))),
        })),
      updateQty: (id, size, color, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              sameLine(i, { id, size, color }) ? { ...i, quantity: Math.max(0, quantity) } : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "yc-cart", storage: createJSONStorage(() => localStorage) }
  )
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);
