import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products — list products with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const collection = searchParams.get("collection");
  const q = searchParams.get("q")?.toLowerCase();
  const featured = searchParams.get("featured") === "true";
  const newArrival = searchParams.get("new") === "true";
  const sort = searchParams.get("sort") ?? "featured";
  const minPrice = Number(searchParams.get("minPrice") ?? "0");
  const maxPrice = Number(searchParams.get("maxPrice") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "0");

  const where: Record<string, unknown> = { status: "active" };
  if (category) {
    const cat = await db.category.findUnique({ where: { slug: category } });
    if (cat) where.categoryId = cat.id;
  }
  if (collection) {
    const col = await db.collection.findUnique({ where: { slug: collection } });
    if (col) where.collections = { some: { collectionId: col.id } };
  }
  if (featured) where.featured = true;
  if (newArrival) where.newArrival = true;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = { gte: minPrice || undefined, lte: maxPrice || undefined };
  }

  const orderBy: Record<string, string> =
    sort === "price-asc" ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "newest" ? { createdAt: "desc" }
    : sort === "rating" ? { rating: "desc" }
    : { createdAt: "desc" };

  const products = await db.product.findMany({
    where,
    orderBy,
    take: limit > 0 ? limit : undefined,
    include: { category: true, collections: { include: { collection: true } }, reviews: true },
  });

  return NextResponse.json({ products: products.map(serializeProduct), count: products.length });
}
