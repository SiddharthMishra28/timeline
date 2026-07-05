"use client";

import { useState, useEffect } from "react";
import { MemoryEntry } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { MediaPreview } from "./MediaPreview";
import { format } from "date-fns";

export function StoryReel({ memories, onClose }: { memories: MemoryEntry[], onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const current = memories[index];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (index < memories.length - 1) {
            setIndex(prevIndex => prevIndex + 1);
            return 0;
          } else {
            setTimeout(() => onClose(), 0);
            return 100;
          }
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, index, memories.length, onClose]);

  const handleNext = () => {
    if (index < memories.length - 1) {
      setIndex(index + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex(index - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col text-white">
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {memories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{
                width: i < index ? "100%" : i === index ? `${progress}%` : "0%"
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-10 px-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">
            {format(current.eventDateTime, "MMMM yyyy")}
          </span>
          <h2 className="text-lg font-black drop-shadow-md">{current.title || "Untiled Moment"}</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full backdrop-blur-md">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            {current.attachments.find(a => a.type === 'photo') ? (
              <MediaPreview attachment={current.attachments.find(a => a.type === 'photo')!} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-indigo-900 to-purple-900">
                <h3 className="text-2xl font-bold mb-4 italic">"{current.description}"</h3>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Caption */}
            <div className="absolute bottom-24 left-6 right-6 space-y-2">
              {current.isAchievement && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 text-black rounded-full text-[10px] font-black uppercase tracking-tighter mb-2">
                   🏆 Achievement Unlocked
                </div>
              )}
              <p className="text-lg font-medium leading-tight text-white/90 drop-shadow-md">
                {current.description}
              </p>
              <div className="flex gap-2">
                {current.tags.map(tag => (
                   <span key={tag} className="text-xs text-white/60">#{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tap areas for navigation */}
        <div className="absolute inset-0 flex">
           <div className="flex-1 h-full cursor-pointer" onClick={handleBack} />
           <div className="w-1/3 h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={48} /> : <Play size={48} />}
           </div>
           <div className="flex-1 h-full cursor-pointer" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}
