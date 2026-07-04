"use client";

import { Plus, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CaptureFAB() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 z-40"
    >
      <Link
        href="/create"
        className="w-16 h-16 energetic-gradient text-white rounded-[2rem] flex items-center justify-center shadow-2xl relative group"
        aria-label="Capture memory"
      >
        <Plus size={36} strokeWidth={3} />
        <div className="absolute -top-1 -right-1 bg-accent text-white p-1.5 rounded-full shadow-lg group-hover:animate-bounce">
           <Zap size={12} fill="currentColor" />
        </div>
      </Link>
    </motion.div>
  );
}
