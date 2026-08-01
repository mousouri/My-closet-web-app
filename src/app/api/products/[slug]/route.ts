import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      collections: { include: { collection: true } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // related: same category, different id
  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: "active" },
    take: 4,
    include: { category: true, collections: { include: { collection: true } }, reviews: true },
  });

  return NextResponse.json({
    product: serializeProduct(product),
    related: related.map(serializeProduct),
  });
}
