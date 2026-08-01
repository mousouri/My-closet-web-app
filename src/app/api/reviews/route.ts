import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProduct, type SerializedReview } from "@/lib/serialize";

// GET /api/reviews?productId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ reviews: [] });

  const reviews = await db.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  const serialized: SerializedReview[] = reviews.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  }));
  return NextResponse.json({ reviews: serialized });
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, authorName, rating, title, body: reviewBody } = body;
    if (!productId || !authorName || !rating || !reviewBody) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const review = await db.review.create({
      data: {
        productId,
        authorName: String(authorName).slice(0, 80),
        rating: Math.max(1, Math.min(5, Number(rating))),
        title: title ? String(title).slice(0, 120) : null,
        body: String(reviewBody).slice(0, 2000),
        verified: false,
      },
    });

    // recalc product rating
    const reviews = await db.review.findMany({ where: { productId } });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await db.product.update({
      where: { id: productId },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length },
    });

    const product = await db.product.findUnique({
      where: { id: productId },
      include: { category: true, collections: { include: { collection: true } }, reviews: true },
    });
    return NextResponse.json({ review, product: product ? serializeProduct(product) : null });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
