"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { TimelineCard } from "@/components/TimelineCard";
import { BottomNav } from "@/components/BottomNav";
import { CaptureFAB } from "@/components/CaptureFAB";
import { AppHeader } from "@/components/AppHeader";
import { PlusCircle, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { StoryReel } from "@/components/StoryReel";

export default function Home() {
  const [isReelOpen, setIsReelOpen] = useState(false);
  const memories = useLiveQuery(
    () => db.memories.orderBy("eventDateTime").reverse().toArray()
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Memories" />

      <div className="max-w-md mx-auto px-4 py-6">
        {memories === undefined ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <PlusCircle size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2">No memories yet</h2>
            <p className="text-muted-foreground mb-6 max-w-[250px]">
              Capture your first moment and start building your timeline.
            </p>
            <Link
              href="/create"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium shadow-sm active:scale-95 transition-transform"
            >
              Start Creating
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Spotlight / Reel Trigger */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20">
                 <Sparkles size={100} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-1">Your Story</h2>
                <p className="text-white/80 text-sm mb-4">Relive your journey through an animated movie of your life.</p>
                <button
                  onClick={() => setIsReelOpen(true)}
                  className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform"
                >
                  <Play size={16} fill="currentColor" />
                  Watch Reel
                </button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-2"
            >
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TimelineCard memory={memory} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isReelOpen && memories && (
          <StoryReel memories={memories} onClose={() => setIsReelOpen(false)} />
        )}
      </AnimatePresence>

      <CaptureFAB />
      <BottomNav />
    </div>
  );
}
