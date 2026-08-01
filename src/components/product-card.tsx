"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/format";
import { Heart, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuickView } from "@/components/quick-view-provider";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt?: number | null;
  image: string;
  images?: string[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  newArrival?: boolean;
  stock?: number;
};

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const quickView = useQuickView();
  const liked = wishlist.items.some((i) => i.id === product.id);
  const [hover, setHover] = React.useState(false);
  const secondImage = product.images?.[1] ?? product.image;

  const onQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = (product.sizes?.[1] ?? product.sizes?.[0] ?? undefined) as string | undefined;
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
    });
    toast.success(`${product.name} added to your bag`);
  };

  const onToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    toast(liked ? "Removed from your closet" : "Saved to your closet");
  };

  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;
  const soldOut = typeof product.stock === "number" && product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group flex flex-col"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.div
          className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              hover ? "opacity-0" : "opacity-100 group-hover:scale-[1.03]"
            )}
          />
          <Image
            src={secondImage}
            alt={`${product.name} - alternate view`}
            aria-hidden
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              hover ? "scale-[1.03] opacity-100" : "opacity-0"
            )}
          />
          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.newArrival && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary">New</Badge>
            )}
            {product.compareAt ? (
              <Badge variant="secondary" className="bg-background/90 text-primary">
                Sale
              </Badge>
            ) : null}
            {lowStock && !soldOut && (
              <Badge variant="outline" className="bg-background/90 text-primary">
                Low stock
              </Badge>
            )}
            {soldOut && (
              <Badge variant="secondary" className="bg-foreground text-background">
                Sold out
              </Badge>
            )}
          </div>

          {/* wishlist */}
          <motion.button
            onClick={onToggleWishlist}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-primary text-primary")} />
            </motion.div>
          </motion.button>

          {/* quick add + quick view */}
          {!soldOut && (
            <motion.div
              className="absolute inset-x-3 bottom-3 flex gap-2"
              initial={false}
              animate={hover ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button onClick={onQuickAdd} className="flex-1" size="sm">
                Add to bag
              </Button>
              <Button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); quickView.open(product); }}
                variant="secondary"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-3 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
            {product.rating ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
                <span aria-label={`Rating ${product.rating.toFixed(1)} out of 5`}>{product.rating.toFixed(1)}</span>
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.compareAt ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
