"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

type Category = { id: string; name: string; slug: string; count: number };

const PRICE_MAX = 1_500_000;
const PRICE_STEP = 10_000;

const SIZES = ["XS", "S", "M", "L", "XL"];

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Blush", hex: "#E8B4BC" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Plum", hex: "#6B1B3C" },
];

export default function ShopPage() {
  return (
    <React.Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </React.Suspense>
  );
}

function ShopFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full rounded-sm" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: products, isLoading } = useProductsQuery();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      return data.categories as Category[];
    },
  });

  const activeCategory = searchParams.get("category") ?? "all";
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const minPrice = Number(searchParams.get("minPrice") ?? "0");
  const maxPrice = Number(searchParams.get("maxPrice") ?? String(PRICE_MAX));
  const activeSize = searchParams.get("size") ?? "";
  const activeColor = searchParams.get("color") ?? "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || value === "all") params.delete(key);
    else params.set(key, value);
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const FiltersContent = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Search</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={q}
            placeholder="Find a piece…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("q", (e.target as HTMLInputElement).value || null);
            }}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Category</p>
        <div className="space-y-1">
          <FilterButton
            label="All pieces"
            count={categories?.reduce((n, c) => n + c.count, 0)}
            active={activeCategory === "all"}
            onClick={() => updateParam("category", null)}
          />
          {categories?.map((c) => (
            <FilterButton
              key={c.id}
              label={c.name}
              count={c.count}
              active={activeCategory === c.slug}
              onClick={() => updateParam("category", c.slug)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Price</p>
        <div className="px-1">
          <Slider
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={[minPrice, maxPrice]}
            onValueChange={(v) => {
              updateParam("minPrice", String(v[0]));
              updateParam("maxPrice", String(v[1]));
            }}
            className="my-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}{maxPrice >= PRICE_MAX ? "+" : ""}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <FilterButton
              key={size}
              label={size}
              active={activeSize === size}
              onClick={() => updateParam("size", activeSize === size ? null : size)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => updateParam("color", activeColor === c.name ? null : c.name)}
              title={c.name}
              aria-label={c.name}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-all",
                activeColor === c.name
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50",
                c.hex === "#FFFFFF" && "border-border"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        {activeColor && (
          <p className="mt-2 text-xs text-muted-foreground">{activeColor}</p>
        )}
      </div>

      <Button variant="outline" className="w-full" onClick={() => router.push("/shop")}>
        Reset filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">The edit</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
          {activeCategory === "all"
            ? "Shop all"
            : categories?.find((c) => c.slug === activeCategory)?.name ?? "Shop"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {q ? <>Results for &ldquo;{q}&rdquo; · </> : null}
          {isLoading ? "Loading…" : `${products?.length ?? 0} pieces`}
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-32">{FiltersContent}</div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{FiltersContent}</div>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex items-center gap-2">
              <Label className="hidden text-xs text-muted-foreground sm:block">Sort by</Label>
              <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
                <SelectTrigger className="w-[180px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="rating">Top rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(activeCategory !== "all" || q || activeSize || activeColor) && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeCategory !== "all" && (
                <Chip onClear={() => updateParam("category", null)}>
                  {categories?.find((c) => c.slug === activeCategory)?.name}
                </Chip>
              )}
              {q && <Chip onClear={() => updateParam("q", null)}>&ldquo;{q}&rdquo;</Chip>}
              {activeSize && <Chip onClear={() => updateParam("size", null)}>Size {activeSize}</Chip>}
              {activeColor && <Chip onClear={() => updateParam("color", null)}>{activeColor}</Chip>}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-2xl">Nothing here yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or browse the full edit.
              </p>
              <Button className="mt-6" onClick={() => router.push("/shop")}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useProductsQuery() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  return useQuery({
    queryKey: ["products", queryString],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryString}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      return data.products as ProductCardData[];
    },
  });
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-secondary text-primary"
          : "text-foreground/80 hover:bg-secondary/60",
        typeof count !== "number" && "w-full"
      )}
    >
      <span>{label}</span>
      {typeof count === "number" && <span className="ml-2 text-xs text-muted-foreground">{count}</span>}
    </button>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs">
      {children}
      <button onClick={onClear} className="text-muted-foreground hover:text-foreground" aria-label="Clear">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
