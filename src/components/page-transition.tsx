"use client";

import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
