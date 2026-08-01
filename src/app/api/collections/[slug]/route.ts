import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const collection = await db.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            include: { category: true, collections: { include: { collection: true } }, reviews: true },
          },
        },
      },
    },
  });
  if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    collection: {
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.image,
      season: collection.season,
    },
    products: collection.products.map((pc) => serializeProduct(pc.product)),
  });
}
