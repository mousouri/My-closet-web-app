import Link from "next/link";
import { db } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";
import { ProductCard } from "@/components/product-card";
import { HeroSection } from "@/components/hero-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedCategories, AnimatedCollections, AnimatedBrandStory } from "@/components/animated-bottom-sections";
import { GlassEditorialBanner } from "@/components/glass-editorial-banner";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  const [featured, newArrivals, categories, collections] = await Promise.all([
    db.product.findMany({
      where: { featured: true, status: "active" },
      take: 4,
      include: { category: true, collections: { include: { collection: true } }, reviews: true },
    }),
    db.product.findMany({
      where: { newArrival: true, status: "active" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true, collections: { include: { collection: true } }, reviews: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
    db.collection.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { _count: { select: { products: true } } } }),
  ]);
  return {
    featured: featured.map(serializeProduct),
    newArrivals: newArrivals.map(serializeProduct),
    categories,
    collections,
  };
}

export default async function HomePage() {
  const { featured, newArrivals, categories, collections } = await getData();

  return (
    <PageTransition>
      {/* HERO */}
      <HeroSection />

      {/* CATEGORIES — with glass hover + tilt + shimmer */}
      <AnimatedCategories categories={categories} />

      {/* FEATURED */}
      <section className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-8 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Loved by you</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Featured pieces</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER — glass panel + parallax image + shimmer */}
      <GlassEditorialBanner
        src={images.editorial[0]}
        alt="The Evening Edit — silk, candlelight"
        subtitle="Collection"
        title="The Evening Edit"
        description="Slips, silk, and candlelight. Eight pieces for dinners that run late."
        ctaLabel="Discover the edit"
        ctaHref="/collections/evening-edit"
      />

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Just landed</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">New arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* BRAND STORY — glass overlay + tilt + floating badges on lifestyle image */}
      <AnimatedBrandStory image={{ src: images.lifestyle[0], alt: "The YOUR CLOSET atelier" }} />

      {/* COLLECTIONS STRIP — glass cards + tilt + shimmer */}
      <AnimatedCollections collections={collections} />

      {/* PROMISES */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: "Complimentary shipping", body: "On all orders over $150, worldwide." },
            { icon: RefreshCw, title: "30-day returns", body: "Changed your mind? Returns are on us." },
            { icon: Shield, title: "Secure checkout", body: "Encrypted payments, every time." },
            { icon: Sparkles, title: "Considered design", body: "Small drops, natural fibres, honest make." },
          ].map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <p.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
