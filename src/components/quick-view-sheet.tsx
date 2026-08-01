"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";
import type { ProductCardData } from "@/components/product-card";

type Props = {
  product: ProductCardData | null;
  open: boolean;
  onClose: () => void;
};

export function QuickViewSheet({ product, open, onClose }: Props) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-background p-0 sm:max-w-lg">
        {product && <QuickViewContent product={product} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}

function QuickViewContent({ product, onClose }: { product: ProductCardData; onClose: () => void }) {
  const [size, setSize] = React.useState<string | undefined>(product.sizes?.[1] ?? product.sizes?.[0]);
  const [qty, setQty] = React.useState(1);
  const [activeImg, setActiveImg] = React.useState(0);
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const liked = wishlist.items.some((i) => i.id === product.id);
  const images = product.images?.length ? product.images : [product.image];

  const onAdd = () => {
    add({ id: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, size }, qty);
    toast.success(`${product.name} added to your bag`);
    onClose();
  };

  return (
    <div>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Image gallery */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image src={images[activeImg]} alt={product.name} fill sizes="500px" className="object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  activeImg === i ? "bg-primary w-6" : "bg-white/60 hover:bg-white/90"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-5 p-6">
        <div>
          <h2 className="font-serif text-2xl">{product.name}</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-lg font-medium">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>
            )}
            {product.rating ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors",
                    size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty + Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border">
            <button className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-primary" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-primary" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={onAdd} size="lg" className="flex-1 rounded-full" disabled={product.stock === 0}>
            {product.stock === 0 ? "Sold out" : "Add to Closet"}
          </Button>
          <Button
            size="lg" variant="outline" className="rounded-full px-3"
            onClick={() => { wishlist.toggle({ id: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price }); toast(liked ? "Removed from your closet" : "Saved to your closet"); }}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn("h-5 w-5", liked && "fill-primary text-primary")} />
          </Button>
        </div>

        {/* Promises */}
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/60 py-3 text-center">
          {[{ icon: Truck, label: "Free shipping $150+" }, { icon: RefreshCw, label: "30-day returns" }, { icon: Shield, label: "Secure checkout" }].map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-1">
              <p.icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground">{p.label}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* View full details link */}
        <Button asChild variant="ghost" className="w-full text-primary">
          <Link href={`/product/${product.slug}`} onClick={onClose}>
            View full details
          </Link>
        </Button>
      </div>
    </div>
  );
}
