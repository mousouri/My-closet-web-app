import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { serializeProduct, type SerializedReview } from "@/lib/serialize";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      collections: { include: { collection: true } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;
  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, status: "active" },
    take: 4,
    include: { category: true, collections: { include: { collection: true } }, reviews: true },
  });
  return {
    product: serializeProduct(product),
    related: related.map(serializeProduct),
    reviews: product.reviews.map((r): SerializedReview => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      body: r.body,
      verified: r.verified,
      createdAt: r.createdAt.toISOString(),
    })),
    category: product.category,
    collections: product.collections.map((pc) => pc.collection),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.product.name,
    image: data.product.images,
    description: data.product.description,
    sku: data.product.slug,
    brand: { "@type": "Brand", name: "YOUR CLOSET" },
    offers: {
      "@type": "Offer",
      price: data.product.price,
      priceCurrency: data.product.currency,
      availability: data.product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: data.product.reviewCount
      ? { "@type": "AggregateRating", ratingValue: data.product.rating, reviewCount: data.product.reviewCount }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail
        product={data.product}
        reviews={data.reviews}
        category={data.category}
        collections={data.collections}
      />
      {data.related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">You may also like</p>
            <h2 className="mt-2 font-serif text-3xl">Complete the look</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-4">
            {data.related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product — YOUR CLOSET" };
  return {
    title: `${product.name} — YOUR CLOSET`,
    description: product.description.slice(0, 160),
  };
}
