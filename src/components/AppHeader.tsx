"use client";

import { motion } from "framer-motion";

export function AppHeader({ title, showSearch = true }: { title: string, showSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/20 px-6 py-6">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-3xl font-black tracking-tighter"
        >
          {title}<span className="text-primary">.</span>
        </motion.h1>
        {showSearch && (
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
               {/* Search handled by navigation */}
               <span className="text-xs font-black">?</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
