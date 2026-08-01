import type { Product, Category, Collection, Review } from "@prisma/client";

export type ProductColor = { name: string; hex: string };

export type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  currency: string;
  image: string;
  images: string[];
  categoryId: string;
  sizes: string[];
  colors: ProductColor[];
  material: string | null;
  care: string | null;
  fit: string | null;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  newArrival: boolean;
};

export type ProductWithRelations = Product & {
  category: Category | null;
  collections: { collection: Collection }[];
  reviews: Review[];
};

export function serializeProduct(p: ProductWithRelations): SerializedProduct {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(p.images);
    if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === "string");
  } catch {
    images = [p.image];
  }
  if (images.length === 0) images = [p.image];

  let sizes: string[] = [];
  try {
    const parsed = JSON.parse(p.sizes);
    if (Array.isArray(parsed)) sizes = parsed.filter((x) => typeof x === "string");
  } catch {
    sizes = ["S"];
  }

  let colors: ProductColor[] = [];
  try {
    const parsed = JSON.parse(p.colors);
    if (Array.isArray(parsed)) colors = parsed;
  } catch {
    colors = [];
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAt: p.compareAt,
    currency: p.currency,
    image: p.image,
    images,
    categoryId: p.categoryId,
    sizes,
    colors,
    material: p.material,
    care: p.care,
    fit: p.fit,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    featured: p.featured,
    newArrival: p.newArrival,
  };
}

export type CategoryWithCounts = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  count: number;
};

export type SerializedCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  season: string | null;
  productCount: number;
};

export type SerializedReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  createdAt: string;
};
