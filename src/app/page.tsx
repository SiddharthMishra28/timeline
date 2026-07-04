"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { TimelineCard } from "@/components/TimelineCard";
import { BottomNav } from "@/components/BottomNav";
import { CaptureFAB } from "@/components/CaptureFAB";
import { AppHeader } from "@/components/AppHeader";
import { Play, Sparkles, Zap, ArrowRight } from "lucide-react";
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
      <AppHeader title="LifeStream" />

      <div className="max-w-md mx-auto px-6 py-8">
        {memories === undefined ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center mb-8 text-primary animate-float">
              <Zap size={64} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">Your story starts here<span className="text-primary">.</span></h2>
            <p className="text-muted-foreground mb-8 max-w-[280px] font-medium">
              Capture your first epic win and build the stream of your life.
            </p>
            <Link
              href="/create"
              className="energetic-gradient text-white px-10 py-4 rounded-full font-black shadow-2xl active:scale-95 transition-transform flex items-center gap-2"
            >
              Start Stream
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Spotlight / Reel Trigger */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="energetic-gradient rounded-[3rem] p-8 text-white shadow-[0_20px_50px_rgba(255,61,113,0.3)] relative overflow-hidden group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 p-4 opacity-10"
              >
                 <Sparkles size={200} />
              </motion.div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/80">
                   <Play size={10} fill="currentColor" />
                   Premiere Now
                </div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter">Life Movie<span className="text-yellow-400">.</span></h2>
                <p className="text-white/90 text-sm mb-6 font-medium leading-relaxed max-w-[200px]">Watch your memories come to life in a cinematic reel.</p>
                <button
                  onClick={() => setIsReelOpen(true)}
                  className="bg-white text-primary px-8 py-3 rounded-full font-black text-sm shadow-xl active:scale-95 transition-transform group-hover:scale-105"
                >
                  Play All
                </button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Timeline Stream</h2>
              </div>
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
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
