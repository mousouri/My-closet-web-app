"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * GlassImageCard — wraps any image with a luxury glass overlay effect.
 *
 * On hover:
 *  - Frosted glass overlay slides in from the bottom
 *  - Light shimmer sweeps across diagonally
 *  - Subtle 3D tilt following the cursor
 *  - Image gently zooms
 *  - Border glow appears
 */
type Props = {
  children: React.ReactNode;
  className?: string;
  overlayContent?: React.ReactNode;
  /** Enable 3D tilt on hover (default: true) */
  tilt?: boolean;
  /** Show shimmer sweep on hover (default: true) */
  shimmer?: boolean;
};

export function GlassImageCard({
  children,
  className,
  overlayContent,
  tilt = true,
  shimmer = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // 3D tilt values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={
        tilt
          ? { perspective: 800, rotateX, rotateY, transformStyle: "preserve-3d" }
          : undefined
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}

      {/* ── Glass overlay that fades in on hover ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Frosted glass layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />

        {/* Gradient from bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />

        {/* Border glow */}
        <div className="absolute inset-0 rounded-inherit ring-1 ring-white/30" />
      </motion.div>

      {/* ── Shimmer sweep ── */}
      {shimmer && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute -inset-1/2 w-[200%] h-[200%]"
            style={{
              background:
                "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)",
            }}
            animate={hovered
              ? { x: ["-100%", "100%"], y: ["-100%", "100%"] }
              : { x: "-100%", y: "-100%" }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      )}

      {/* ── Overlay content (label, CTA, etc.) ── */}
      {overlayContent && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col justify-end"
          initial={{ opacity: 0, y: 12 }}
          animate={
            hovered
              ? { opacity: 1, y: 0 }
              : { opacity: overlayContent ? 0.85 : 0, y: overlayContent ? 0 : 12 }
          }
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative z-10">{overlayContent}</div>
        </motion.div>
      )}
    </motion.div>
  );
}
