import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

async function getCollection(slug: string) {
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
  if (!collection) return null;
  return {
    collection,
    products: collection.products.map((pc) => serializeProduct(pc.product)),
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) notFound();
  const { collection, products } = data;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {collection.image && (
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {collection.season && (
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">{collection.season}</p>
            )}
            <h1 className="mt-2 font-serif text-4xl text-white sm:text-6xl">{collection.name}</h1>
            {collection.description && (
              <p className="mt-3 max-w-xl text-sm text-white/80">{collection.description}</p>
            )}
            <p className="mt-2 text-xs uppercase tracking-wider text-white/60">{products.length} pieces</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">The edit</p>
          <Link href="/collections" className="text-sm text-primary hover:underline">
            All collections
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await db.collection.findUnique({ where: { slug } });
  if (!c) return { title: "Collection — YOUR CLOSET" };
  return { title: `${c.name} — YOUR CLOSET`, description: c.description ?? undefined };
}
