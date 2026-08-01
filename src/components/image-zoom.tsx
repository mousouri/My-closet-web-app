"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ImageZoom — wraps a product image with click-to-zoom functionality.
 * Shows a magnified lens on hover, and opens a full-screen lightbox on click.
 */
type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ImageZoom({ src, alt, fill = true, sizes, className, priority }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [lensPos, setLensPos] = React.useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = React.useState(false);
  const [bgPos, setBgPos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setBgPos({ x, y });
  };

  return (
    <>
      {/* Main image container */}
      <div
        ref={containerRef}
        className={cn("relative cursor-zoom-in overflow-hidden rounded-sm", className)}
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(true)}
      >
        <Image src={src} alt={alt} fill={fill} sizes={sizes} priority={priority} className="object-cover" />

        {/* Zoom hint icon */}
        <AnimatePresence>
          {!showLens && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Magnifying lens (desktop hover) */}
        <AnimatePresence>
          {showLens && !isZoomed && (
            <motion.div
              className="pointer-events-none absolute z-10 hidden h-40 w-40 overflow-hidden rounded-full border-2 border-white/50 shadow-2xl sm:block"
              style={{
                left: lensPos.x - 80,
                top: lensPos.y - 80,
                backgroundImage: `url(${src})`,
                backgroundSize: "300% 300%",
                backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <button
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={() => setIsZoomed(false)}
              aria-label="Close zoom"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              className="relative h-[85vh] w-[85vw] max-w-4xl overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={src} alt={alt} fill sizes="90vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
