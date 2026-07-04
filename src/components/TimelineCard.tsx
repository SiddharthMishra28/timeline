"use client";

import { MemoryEntry } from "@/types";
import { format } from "date-fns";
import { MapPin, Heart, Pin, Sparkles, Smile, MessageCircle, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMediaUrl } from "@/hooks/useMediaUrl";
import { motion } from "framer-motion";
import { db } from "@/lib/db";

interface TimelineCardProps {
  memory: MemoryEntry;
}

export function TimelineCard({ memory }: TimelineCardProps) {
  const firstPhoto = memory.attachments.find(a => a.type === 'photo');
  const mediaUrl = useMediaUrl(firstPhoto);

  const addReaction = async (e: React.MouseEvent, emoji: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentReactions = memory.reactions || [];
    await db.memories.update(memory.id!, {
      reactions: [...currentReactions, emoji].slice(-5)
    });
  };

  return (
    <Link href={`/memory/${memory.id}`} className="block">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-card rounded-[2.5rem] overflow-hidden shadow-2xl border-4 ${memory.isAchievement ? 'border-primary shadow-primary/20' : 'border-white dark:border-white/5'} mb-6 group transition-all duration-500`}
      >
        {mediaUrl ? (
          <div className="relative h-64 w-full bg-muted overflow-hidden">
             <Image
              src={mediaUrl}
              alt={memory.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
             {memory.isAchievement && (
               <div className="absolute top-6 left-6 energetic-gradient text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter flex items-center gap-2 shadow-xl animate-bounce">
                 <Sparkles size={14} fill="currentColor" />
                 Epic Win
               </div>
             )}
          </div>
        ) : (
          <div className="h-32 w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
             <Sparkles className="text-primary/20" size={48} />
          </div>
        )}

        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-3">
            <h3 className={`text-2xl font-black leading-tight tracking-tight ${memory.isAchievement ? 'text-primary' : 'text-foreground'}`}>
              {memory.title || "Untitled Moment"}
            </h3>
            <div className="flex gap-2 shrink-0">
              {memory.favorite && <Heart size={20} className="text-primary fill-primary" />}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed font-medium">
            {memory.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
            <span className="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">{format(memory.eventDateTime, "MMM d, yyyy")}</span>
            {memory.locationName && (
              <span className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                <MapPin size={12} strokeWidth={3} />
                {memory.locationName}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border/50">
             <div className="flex -space-x-2">
                {(memory.reactions && memory.reactions.length > 0) ? (
                   memory.reactions.map((r, i) => (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={i}
                        className="w-8 h-8 flex items-center justify-center bg-card border-2 border-white dark:border-background rounded-full text-sm shadow-md"
                      >
                         {r}
                      </motion.span>
                   ))
                ) : (
                   <div className="flex gap-3">
                      <button onClick={(e) => addReaction(e, "🔥")} className="hover:scale-150 transition-transform text-xl">🔥</button>
                      <button onClick={(e) => addReaction(e, "⚡")} className="hover:scale-150 transition-transform text-xl">⚡</button>
                      <button onClick={(e) => addReaction(e, "💎")} className="hover:scale-150 transition-transform text-xl">💎</button>
                   </div>
                )}
             </div>

             <button className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full shadow-lg hover:rotate-12 transition-transform">
                <Play size={16} fill="currentColor" />
             </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
