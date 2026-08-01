"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Full-width editorial banner with glass parallax effect.
 * The image shifts subtly with cursor, and a glass panel holds the CTA.
 */
type Props = {
  src: string;
  alt: string;
  subtitle: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function GlassEditorialBanner({
  src,
  alt,
  subtitle,
  title,
  description,
  ctaLabel,
  ctaHref,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const imgX = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 80, damping: 20 });
  const imgY = useSpring(useTransform(mouseY, [0, 1], [-6, 6]), { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {/* Parallax image */}
        <motion.div
          className="absolute inset-[-20px]"
          style={{ x: imgX, y: imgY }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        {/* Shimmer sweep on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute -inset-1/2 h-[200%] w-[200%]"
            style={{
              background:
                "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 58%, transparent 75%)",
            }}
            animate={hovered ? { x: ["-100%", "100%"] } : { x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        {/* Content in a glass panel */}
        <div className="absolute inset-0 flex items-center">
          <motion.div
            className="mx-6 sm:mx-12 lg:mx-20"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="max-w-xl rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              whileHover={{
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-xs font-medium uppercase tracking-[0.3em] text-white/70"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
              <motion.h2
                className="mt-2 font-serif text-4xl text-white sm:text-5xl"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {title}
              </motion.h2>
              <motion.p
                className="mt-3 max-w-md text-sm text-white/80"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button
                  asChild
                  className="mt-6 rounded-full border border-white/30 bg-white/20 px-7 text-white backdrop-blur-md hover:bg-white/30"
                >
                  <Link href={ctaHref}>
                    {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
