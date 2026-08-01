"use client";

import * as React from "react";
import { QuickViewSheet } from "./quick-view-sheet";
import type { ProductCardData } from "./product-card";

const QuickViewCtx = React.createContext<{
  open: (product: ProductCardData) => void;
}>({ open: () => {} });

export function useQuickView() {
  return React.useContext(QuickViewCtx);
}

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = React.useState<ProductCardData | null>(null);
  const open = React.useCallback((p: ProductCardData) => setProduct(p), []);
  const close = React.useCallback(() => setProduct(null), []);

  return (
    <QuickViewCtx.Provider value={{ open }}>
      {children}
      <QuickViewSheet product={product} open={!!product} onClose={close} />
    </QuickViewCtx.Provider>
  );
}
