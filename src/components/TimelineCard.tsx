"use client";

import { MemoryEntry } from "@/types";
import { format } from "date-fns";
import { MapPin, Heart, Pin, Sparkles, Smile, MessageCircle } from "lucide-react";
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
      reactions: [...currentReactions, emoji].slice(-5) // Keep last 5
    });
  };

  return (
    <Link href={`/memory/${memory.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        className={`bg-card rounded-3xl overflow-hidden shadow-sm border ${memory.isAchievement ? 'border-yellow-400 shadow-yellow-100 dark:shadow-yellow-900/20' : 'border-border'} mb-4 active:scale-[0.98] transition-all duration-300`}
      >
        {mediaUrl && (
          <div className="relative h-56 w-full bg-muted">
             <Image
              src={mediaUrl}
              alt={memory.title}
              fill
              className="object-cover"
              unoptimized
             />
             {memory.isAchievement && (
               <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                 <Sparkles size={12} fill="currentColor" />
                 Achievement
               </div>
             )}
          </div>
        )}

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-xl font-black leading-tight ${memory.isAchievement ? 'text-yellow-700 dark:text-yellow-500' : ''}`}>
              {memory.title || "Untitled Moment"}
            </h3>
            <div className="flex gap-2 shrink-0">
              {memory.pinned && <Pin size={18} className="text-primary fill-primary" />}
              {memory.favorite && <Heart size={18} className="text-red-500 fill-red-500" />}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {memory.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium mb-4">
            <span className="bg-muted px-2 py-1 rounded-md">{format(memory.eventDateTime, "MMM d, yyyy")}</span>
            {memory.locationName && (
              <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <MapPin size={12} />
                {memory.locationName}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
             <div className="flex -space-x-1">
                {(memory.reactions && memory.reactions.length > 0) ? (
                   memory.reactions.map((r, i) => (
                      <span key={i} className="w-6 h-6 flex items-center justify-center bg-background border border-border rounded-full text-xs shadow-sm">
                         {r}
                      </span>
                   ))
                ) : (
                   <div className="flex gap-2">
                      <button onClick={(e) => addReaction(e, "❤️")} className="hover:scale-125 transition-transform">❤️</button>
                      <button onClick={(e) => addReaction(e, "🔥")} className="hover:scale-125 transition-transform">🔥</button>
                      <button onClick={(e) => addReaction(e, "👏")} className="hover:scale-125 transition-transform">👏</button>
                   </div>
                )}
             </div>

             <div className="flex items-center gap-3 text-muted-foreground">
                <Smile size={18} />
                <MessageCircle size={18} />
             </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
