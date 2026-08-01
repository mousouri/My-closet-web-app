"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { DressMark } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
};

type Collection = {
  id: string;
  name: string;
  slug: string;
  season: string | null;
  image: string | null;
  _count: { products: number };
};

type LifestyleImg = { src: string; alt: string };

/* ── Reusable tilt card hook ── */
function useTilt(strength = 4) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const cfg = { stiffness: 150, damping: 20, mass: 0.5 };
  const rx = useSpring(useTransform(my, [0, 1], [strength, -strength]), cfg);
  const ry = useSpring(useTransform(mx, [0, 1], [-strength, strength]), cfg);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return {
    ref,
    style: { perspective: 800, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" as const },
    onMove,
    onLeave,
  };
}

/* ── Shimmer sweep overlay ── */
function ShimmerOverlay({ show }: { show: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute -inset-1/2 h-[200%] w-[200%]"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.12) 44%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 56%, transparent 70%)",
        }}
        animate={show ? { x: ["-100%", "100%"], y: ["-100%", "100%"] } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

/* ── Glass hover overlay with blur + border ── */
function GlassHoverOverlay({ show }: { show: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-white/8 backdrop-blur-[1.5px]" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/25" />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   CATEGORIES GRID
   ══════════════════════════════════════════ */
export function AnimatedCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="mb-8 flex items-end justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Shop by category</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">The Closet</h2>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <CategoryCard key={c.id} category={c} index={i} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTilt(3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        ref={tilt.ref}
        style={tilt.style}
        className={cn(
          "group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted",
          index === 0 && "md:col-span-2"
        )}
        onMouseMove={tilt.onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          tilt.onLeave();
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {category.image && (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes={index === 0 ? "(max-width: 768px) 50vw, 30vw" : "(max-width: 768px) 50vw, 16vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Persistent gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/0" />

        {/* Glass hover overlay */}
        <GlassHoverOverlay show={hovered} />

        {/* Shimmer */}
        <ShimmerOverlay show={hovered} />

        {/* Label - always visible, elevates on hover */}
        <motion.div
          className="absolute bottom-3 left-3 right-3"
          animate={hovered ? { y: -4 } : { y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-serif text-lg text-white drop-shadow-lg">{category.name}</p>
          <p className="text-[11px] uppercase tracking-wider text-white/70">
            {category._count.products} pieces
          </p>
        </motion.div>

        {/* Corner glass badge on hover */}
        <motion.div
          className="absolute right-3 top-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Explore
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   COLLECTIONS STRIP
   ══════════════════════════════════════════ */
export function AnimatedCollections({ collections }: { collections: Collection[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Edits</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Curated collections</h2>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((c, i) => (
          <CollectionCard key={c.id} collection={c} index={i} />
        ))}
      </div>
    </section>
  );
}

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTilt(4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/collections/${collection.slug}`}>
        <motion.div
          ref={tilt.ref}
          style={tilt.style}
          className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-muted"
          onMouseMove={tilt.onMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            tilt.onLeave();
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {collection.image && (
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* Persistent gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Glass overlay */}
          <GlassHoverOverlay show={hovered} />

          {/* Shimmer */}
          <ShimmerOverlay show={hovered} />

          {/* Content with glass card */}
          <motion.div
            className="absolute bottom-5 left-5 right-5"
            animate={hovered ? { y: -4 } : { y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
              animate={
                hovered
                  ? { backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }
                  : { backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(4px)" }
              }
              transition={{ duration: 0.4 }}
            >
              {collection.season && (
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                  {collection.season}
                </p>
              )}
              <p className="mt-1 font-serif text-2xl text-white">{collection.name}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/90">
                Explore{" "}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </p>
            </motion.div>
          </motion.div>

          {/* Top-right floating glass piece count */}
          <motion.div
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md"
            initial={{ opacity: 0, y: -8 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {collection._count.products} pieces
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   BRAND STORY (lifestyle image + text)
   ══════════════════════════════════════════ */
export function AnimatedBrandStory({ image }: { image: LifestyleImg }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTilt(3);

  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        {/* Image with glass effect */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            ref={tilt.ref}
            style={tilt.style}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-xl"
            onMouseMove={tilt.onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              tilt.onLeave();
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700"
              style={hovered ? { transform: "scale(1.05)" } : undefined}
            />

            {/* Glass overlay */}
            <GlassHoverOverlay show={hovered} />

            {/* Shimmer */}
            <ShimmerOverlay show={hovered} />

            {/* Floating glass detail badge */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                Est. 2024
              </p>
              <p className="mt-0.5 font-serif text-lg text-white">Our Atelier</p>
            </motion.div>

            {/* Corner accent glass */}
            <motion.div
              className="absolute right-4 top-4 h-16 w-16 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <DressMark className="h-12 w-12 text-primary" />
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">We make clothes you keep.</h2>
            <p className="mt-4 text-muted-foreground">
              YOUR CLOSET began with a single slip dress and a simple idea: that elegance
              should feel easy. We design in small, considered drops — natural fibres,
              honest construction, and silhouettes that move with you rather than against
              you.
            </p>
            <p className="mt-3 text-muted-foreground">
              No seasons you can&apos;t keep up with. No trends that won&apos;t last the
              year. Just a quietly growing wardrobe of pieces designed to be lived in.
            </p>
            <Button asChild variant="outline" className="mt-6 rounded-full">
              <Link href="/about">Our story</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
