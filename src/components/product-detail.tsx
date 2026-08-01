"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { SerializedProduct, SerializedReview } from "@/lib/serialize";
import type { Category, Collection } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageZoom } from "@/components/image-zoom";
import { SizeGuideDialog } from "@/components/size-guide-dialog";
import {
  Heart,
  Star,
  Truck,
  RefreshCw,
  Shield,
  Minus,
  Plus,
  Check,
} from "lucide-react";

export function ProductDetail({
  product,
  reviews,
  category,
  collections,
}: {
  product: SerializedProduct;
  reviews: SerializedReview[];
  category: Category | null;
  collections: Collection[];
}) {
  const [activeImage, setActiveImage] = React.useState(0);
  const [size, setSize] = React.useState<string | undefined>(product.sizes[1] ?? product.sizes[0]);
  const [color, setColor] = React.useState<string | undefined>(product.colors[0]?.name);
  const [qty, setQty] = React.useState(1);
  const add = useCart((s) => s.add);
  const wishlist = useWishlist();
  const liked = wishlist.items.some((i) => i.id === product.id);

  /* ── Swipe tracking refs ── */
  const swipeRef = React.useRef<HTMLDivElement>(null);
  const startXRef = React.useRef<number | null>(null);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    /* nothing here — tracking is resolved on pointer up */
  }, []);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    const threshold = 40;
    if (diff < -threshold) {
      /* swipe left → next image */
      setActiveImage((prev) =>
        prev < product.images.length - 1 ? prev + 1 : prev
      );
    } else if (diff > threshold) {
      /* swipe right → previous image */
      setActiveImage((prev) => (prev > 0 ? prev - 1 : prev));
    }
    startXRef.current = null;
  }, [product.images.length]);

  /* ── Color change → reset active image ── */
  const handleColorChange = React.useCallback((c: string) => {
    setColor(c);
    if (product.images.length > 1) {
      setActiveImage(0);
    }
  }, [product.images.length]);

  /* ── Quantity clamped to stock ── */
  const maxQty = product.stock;
  const atMax = qty >= maxQty;

  const onAdd = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        size,
        color,
      },
      qty
    );
    toast.success(`${product.name} added to your bag`);
  };

  const onToggleWishlist = () => {
    wishlist.toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    toast(liked ? "Removed from your closet" : "Saved to your closet");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* ── Breadcrumb (shadcn) ── */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/shop?category=${category.slug}`}>
                    {category.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── Gallery ── */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails (hidden on small touch devices, visible on sm+) */}
          <div className="hidden gap-3 overflow-x-auto sm:flex sm:flex-col sm:overflow-visible">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-sm border-2 bg-muted transition-colors sm:h-24 sm:w-20",
                  activeImage === i ? "border-primary" : "border-transparent"
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} - view ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image — with swipe support on touch devices */}
          <div className="relative flex-1">
            <div
              ref={swipeRef}
              className="relative aspect-[3/4] touch-pan-y overflow-hidden rounded-sm bg-muted"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ touchAction: "pan-y" }}
            >
              <ImageZoom
                src={product.images[activeImage] ?? product.image}
                alt={product.name}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-sm"
              />
              {product.compareAt && (
                <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground">
                  Save {formatPrice(product.compareAt - product.price)}
                </Badge>
              )}
            </div>

            {/* Mobile swipe dot indicators (visible on touch devices only) */}
            {product.images.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-200",
                      activeImage === i
                        ? "w-6 bg-primary"
                        : "w-2 bg-primary/30"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="lg:py-2">
          {collections[0] && (
            <Link
              href={`/collections/${collections[0].slug}`}
              className="text-xs font-medium uppercase tracking-[0.25em] text-primary hover:underline"
            >
              {collections[0].name}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-medium">{formatPrice(product.price)}</span>
            {product.compareAt ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            ) : null}
            {product.compareAt ? (
              <Badge variant="secondary" className="bg-secondary text-primary">
                {Math.round((1 - product.price / product.compareAt) * 100)}% off
              </Badge>
            ) : null}
          </div>

          {/* Star rating — with accessibility */}
          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div
                className="flex"
                role="img"
                aria-label={`Average rating ${product.rating.toFixed(1)} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating.toFixed(1)} · {product.reviewCount} review
                {product.reviewCount === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* ── Colour ── */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Colour
                </Label>
                <span className="text-sm">{color}</span>
              </div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c.name)}
                    aria-label={c.name}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                      color === c.name ? "border-primary" : "border-border"
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
              {/* Active color label under swatches */}
              {color && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{color}</span>
                </p>
              )}
            </div>
          )}

          {/* ── Size ── */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Size
                </Label>
                <SizeGuideDialog>
                  <button className="text-xs text-primary hover:underline">
                    Size guide
                  </button>
                </SizeGuideDialog>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center rounded-sm border px-4 text-sm font-medium transition-colors",
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quantity + Add ── */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-primary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                className={cn(
                  "flex h-11 w-11 items-center justify-center transition-colors",
                  atMax
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                aria-label="Increase quantity"
                disabled={atMax}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={onAdd}
              size="lg"
              className="flex-1 rounded-full"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Sold out" : "Add to Closet"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-4"
              onClick={onToggleWishlist}
              aria-label="Toggle wishlist"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  liked && "fill-primary text-primary"
                )}
              />
            </Button>
          </div>

          {product.stock > 0 && product.stock <= 5 && (
            <p className="mt-3 text-xs font-medium text-primary">
              Only {product.stock} left — this piece moves quickly.
            </p>
          )}

          {/* ── Promises ── */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-y border-border/60 py-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                Free shipping $150+
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                30-day returns
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                Secure checkout
              </span>
            </div>
          </div>

          {/* ── Details accordion ── */}
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm font-medium">
                The details
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                <dl className="space-y-2">
                  {product.material && (
                    <div className="flex gap-2">
                      <dt className="w-24 text-foreground/70">Material</dt>
                      <dd>{product.material}</dd>
                    </div>
                  )}
                  {product.fit && (
                    <div className="flex gap-2">
                      <dt className="w-24 text-foreground/70">Fit</dt>
                      <dd>{product.fit}</dd>
                    </div>
                  )}
                  {product.care && (
                    <div className="flex gap-2">
                      <dt className="w-24 text-foreground/70">Care</dt>
                      <dd>{product.care}</dd>
                    </div>
                  )}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm font-medium">
                Shipping & returns
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Complimentary shipping on orders over $150. Standard delivery
                3–5 business days. Returns accepted within 30 days — on us. See
                our full policy{" "}
                <Link href="/faq" className="text-primary hover:underline">
                  here
                </Link>
                .
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <Separator className="my-12" />

      {/* ── Reviews ── */}
      <ReviewsSection product={product} initialReviews={reviews} />
    </div>
  );
}

/* ──────────────────────────────────────────── */

function ReviewsSection({
  product,
  initialReviews,
}: {
  product: SerializedProduct;
  initialReviews: SerializedReview[];
}) {
  const [reviews, setReviews] = React.useState(initialReviews);
  const [rating, setRating] = React.useState(5);
  const [name, setName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: name,
          rating,
          title,
          body,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Thank you — your review has been posted");
      setReviews([
        {
          id: Math.random().toString(36),
          authorName: name,
          rating,
          title: title || null,
          body,
          verified: false,
          createdAt: new Date().toISOString(),
        },
        ...reviews,
      ]);
      setName("");
      setTitle("");
      setBody("");
      setRating(5);
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Reviews
        </p>
        <h2 className="mt-2 font-serif text-3xl">
          What women are saying
        </h2>

        {/* Average star rating — with accessibility */}
        <div className="mt-4 flex items-center gap-3">
          <div
            className="flex"
            role="img"
            aria-label={`Average rating ${avg.toFixed(1)} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(avg)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/40"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {avg.toFixed(1)} · {reviews.length} review
            {reviews.length === 1 ? "" : "s"}
          </span>
        </div>

        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name || !body) return;
            mutation.mutate();
          }}
        >
          <p className="text-sm font-medium">Write a review</p>
          <div>
            <Label className="text-xs text-muted-foreground">Your rating</Label>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  aria-label={`${i + 1} stars`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      i < rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Tell us how it fits, how it feels…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Posting…" : "Post review"}
          </Button>
        </form>
      </div>

      <div className="lg:col-span-2">
        {reviews.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-sm border border-dashed border-border py-16 text-center">
            <div>
              <p className="font-serif text-xl">No reviews yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share your thoughts.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-border/60 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-primary">
                      {r.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.authorName}</p>
                      {r.verified && (
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Check className="h-3 w-3" /> Verified buyer
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Individual review star rating — with accessibility */}
                  <div
                    className="flex"
                    role="img"
                    aria-label={`Rating ${r.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < r.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/40"
                        )}
                      />
                    ))}
                  </div>
                </div>
                {r.title && (
                  <p className="mt-3 text-sm font-medium">{r.title}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
