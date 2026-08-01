import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const collections = await db.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      season: c.season,
      productCount: c._count.products,
    })),
  });
}
