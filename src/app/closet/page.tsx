"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format";
import { Heart, Trash2, ShoppingBag, ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";

type SortOption = "recent" | "price-asc" | "price-desc" | "name-asc";

export default function ClosetPage() {
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const clearWishlist = useWishlist((s) => s.clear);
  const add = useCart((s) => s.add);
  const [sort, setSort] = React.useState<SortOption>("recent");

  const sortedItems = React.useMemo(() => {
    const copy = [...items];
    switch (sort) {
      case "price-asc":
        return copy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "name-asc":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return copy;
    }
  }, [items, sort]);

  const handleMoveAllToBag = () => {
    if (items.length === 0) return;
    items.forEach((item) => {
      add({ id: item.id, slug: item.slug, name: item.name, image: item.image, price: item.price });
    });
    toast.success(`${items.length} piece${items.length === 1 ? "" : "s"} moved to your bag`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success("Your wishlist has been cleared");
  };

  const handleShare = () => {
    const message = `Check out my wishlist on YOUR CLOSET! ${sortedItems.map((i) => `• ${i.name} (${formatPrice(i.price)})`).join("\n")}`;
    navigator.clipboard.writeText(message).then(() => {
      toast.success("Closet link copied to clipboard");
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Saved for later</p>
        <h1 className="mt-2 flex items-center gap-3 font-serif text-4xl sm:text-5xl">
          <Heart className="h-7 w-7 fill-primary text-primary" /> My Closet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {items.length === 0 ? "No saved pieces yet." : `${items.length} piece${items.length === 1 ? "" : "s"} saved`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-20 text-center">
          <div className="rounded-full bg-secondary p-5">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="mt-4 font-serif text-2xl">Your closet is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any piece to save it here for later.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Browse the edit</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Sort & Actions Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-[180px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleMoveAllToBag}>
              <ShoppingBag className="mr-1.5 h-4 w-4" /> Move all to bag
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-1.5 h-4 w-4" /> Share closet
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearWishlist} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear wishlist
            </Button>
          </div>

          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group flex flex-col rounded-sm border border-border/60 bg-background shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-t-sm bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:text-primary">{item.name}</Link>
                  <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        add({ id: item.id, slug: item.slug, name: item.name, image: item.image, price: item.price });
                        toast.success(`${item.name} added to your bag`);
                      }}
                    >
                      <ShoppingBag className="mr-1.5 h-4 w-4" /> Add to bag
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => remove(item.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {items.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/shop">Keep browsing <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      )}
    </div>
  );
}
