import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DressMark } from "@/components/brand-logo";
import { images } from "@/lib/images";
import { Sparkles, Leaf, Heart, Gem } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <Image src={images.lifestyle[0]} alt="The YOUR CLOSET atelier" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-2xl px-6">
            <DressMark className="mx-auto h-12 w-12" />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-white/70">Our story</p>
            <h1 className="mt-2 font-serif text-4xl sm:text-6xl">Effortlessly elegant</h1>
            <p className="mt-3 text-sm text-white/80">
              We make clothes you keep. Natural fibres, honest construction, small considered drops.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose-yc space-y-6 text-base leading-relaxed text-foreground/80">
          <p className="font-serif text-2xl text-foreground">
            YOUR CLOSET began with a single slip dress.
          </p>
          <p>
            Our founder had spent a decade in fashion — chasing trends, attending the shows, watching
            clothes designed to be worn once and forgotten. She wanted the opposite: a small, considered
            wardrobe of pieces designed to be lived in. So she made one. A bias-cut silk slip in plum,
            cut to move, weighted to fall just so. She wore it to dinner, to galleries, to a wedding,
            to the office. Then she made a few more.
          </p>
          <p>
            That was the beginning. Today, YOUR CLOSET is a small, independent house designing in
            twelve-piece drops. We work in silk, cashmere, organic cotton and recycled fibres. We
            manufacture in small runs at family-owned ateliers in Portugal and Italy. And we design
            everything to outlast the season it was made in.
          </p>
          <p>
            We believe elegance should feel easy — that the best clothes are the ones you reach for
            without thinking. That&apos;s what effortlessly elegant means to us. Not loud, not complicated,
            not chasing the next thing. Just quietly, perfectly right.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">What we stand for</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Our promises</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Gem, title: "Considered design", body: "Small drops, designed to layer. We make twelve pieces a season — not a hundred." },
              { icon: Leaf, title: "Natural fibres", body: "Silk, cashmere, organic cotton, recycled weaves. Nothing plastic disguised as luxury." },
              { icon: Heart, title: "Honest make", body: "Family-owned ateliers in Portugal and Italy. Fair wages, small runs, real craft." },
              { icon: Sparkles, title: "Built to keep", body: "Every piece is designed to outlast the season. Repair, rewear, pass it on." },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image src={images.editorial[0]} alt="Editorial" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image src={images.lifestyle[1]} alt="Atelier" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image src={images.lookbook[0]} alt="Lookbook" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl">Come and see</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The current edit is live. Twelve pieces, made to be lived in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="/shop">Shop the edit</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link href="/collections">View collections</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
