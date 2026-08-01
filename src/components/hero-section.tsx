"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary/40 pb-8 lg:pb-12">
      {/* ── Colour blobs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-20 top-10 h-[340px] w-[340px] rounded-full bg-[#6B1B3C]/25 blur-[100px] lg:left-20 lg:top-0 lg:h-[420px] lg:w-[420px]"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-10 top-1/3 h-[280px] w-[280px] rounded-full bg-[#C9A66B]/20 blur-[90px] lg:right-32 lg:h-[360px] lg:w-[360px]"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 25, -10, 0],
            scale: [1, 0.97, 1.04, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-1/4 h-[240px] w-[240px] rounded-full bg-[#E8B4BC]/30 blur-[80px] lg:bottom-0 lg:left-[15%] lg:h-[300px] lg:w-[300px]"
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-0 px-4 py-0 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* ── Text column ── */}
        <motion.div
          className="order-2 flex flex-col justify-center px-2 py-16 lg:order-1 lg:py-28 lg:pr-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> New season &middot; Resort 25
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
          >
            effortlessly
            <br />
            <span className="text-primary italic">elegant</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Curated women&apos;s fashion. Silk slips that move with you, considered evening wear,
            and quietly perfect basics &mdash; designed to be lived in.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/shop">Shop the edit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="/collections">Explore collections</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Free shipping $150+</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4 text-primary" /> 30-day returns</span>
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Secure checkout</span>
          </motion.div>
        </motion.div>

        {/* ── Hero image ── */}
        <motion.div
          className="relative order-1 aspect-[4/5] w-full overflow-hidden lg:order-2 lg:aspect-[3/4]"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={images.hero[0]}
              alt="Model wearing the Aurora silk slip dress in soft natural light"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          {/* Featured glass card */}
          <motion.div
            className="absolute bottom-5 left-5 rounded-xl border border-white/25 bg-white/70 px-5 py-4 shadow-lg backdrop-blur-xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(107,27,60,0.12)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Featured</p>
            <p className="font-serif text-lg">The Aurora Silk Slip</p>
            <Link
              href="/product/aurora-silk-slip"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Shop now <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
