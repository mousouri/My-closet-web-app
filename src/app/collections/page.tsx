import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { images } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Edits</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Collections</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Small, considered drops. Each collection is a mood, a moment, a way of dressing —
          designed to layer into the rest of your closet.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {collections.map((c, i) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-muted sm:aspect-[16/10]"
          >
            {c.image && (
              <Image
                src={c.image}
                alt={c.name}
                fill
                priority={i < 2}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              {c.season && (
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">{c.season}</p>
              )}
              <p className="mt-1 font-serif text-3xl text-white sm:text-4xl">{c.name}</p>
              {c.description && (
                <p className="mt-2 max-w-md text-sm text-white/80">{c.description}</p>
              )}
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white">
                Explore {c._count.products} pieces
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA strip */}
      <div className="mt-16 overflow-hidden rounded-sm bg-secondary/40">
        <div className="grid items-center gap-6 p-8 sm:p-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">The full closet</p>
            <h2 className="mt-2 font-serif text-3xl">Browse every piece</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All slips, dresses, evening wear and basics — in one place.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Shop all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
            <Image src={images.lookbook[2]} alt="Lookbook" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
