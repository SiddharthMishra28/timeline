"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Edit,
  Trash2,
  Heart,
  Pin,
  MapPin,
  Calendar,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { BottomNav } from "@/components/BottomNav";
import { MediaPreview } from "@/components/MediaPreview";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function MemoryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const memory = useLiveQuery(() => db.memories.get(id));

  useEffect(() => {
    if (memory?.isAchievement) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EAB308', '#FACC15', '#000000']
      });
    }
  }, [memory?.id, memory?.isAchievement]);

  if (memory === undefined) return null;
  if (memory === null) return <div>Memory not found</div>;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this memory?")) {
      await db.memories.delete(id);
      router.push("/");
    }
  };

  const toggleFavorite = async () => {
    await db.memories.update(id, { favorite: !memory.favorite });
  };

  const togglePinned = async () => {
    await db.memories.update(id, { pinned: !memory.pinned });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.title,
          text: memory.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button onClick={togglePinned} className={`p-2 rounded-full ${memory.pinned ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
            <Pin size={20} fill={memory.pinned ? "currentColor" : "none"} />
          </button>
          <button onClick={toggleFavorite} className={`p-2 rounded-full ${memory.favorite ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground'}`}>
            <Heart size={20} fill={memory.favorite ? "currentColor" : "none"} />
          </button>
          <button onClick={() => router.push(`/memory/${id}/edit`)} className="p-2 text-muted-foreground">
            <Edit size={20} />
          </button>
          <button onClick={handleDelete} className="p-2 text-muted-foreground">
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full">
        {/* Media Gallery */}
        {memory.attachments && memory.attachments.length > 0 && (
          <div className="w-full bg-muted overflow-x-auto snap-x snap-mandatory flex aspect-[4/3] relative border-b border-border">
            {memory.attachments.map((attachment) => (
              <div key={attachment.id} className="w-full h-full shrink-0 snap-center relative">
                <MediaPreview attachment={attachment} />
              </div>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          {memory.isAchievement && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-2xl font-black uppercase tracking-tighter shadow-lg animate-bounce">
               <Sparkles size={20} fill="currentColor" />
               Achievement Unlocked
            </div>
          )}
          <div className="space-y-2">
            <h1 className={`text-4xl font-black leading-tight ${memory.isAchievement ? 'text-yellow-600' : ''}`}>
              {memory.title || "Untitled Moment"}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {format(memory.eventDateTime, "PPPP 'at' p")}
              </span>
              {memory.locationName && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(memory.locationName!)}${memory.latitude ? `&query_place_id=${memory.latitude},${memory.longitude}` : ''}`, '_blank')}
                  className="flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full hover:scale-105 transition-transform"
                >
                  <MapPin size={16} strokeWidth={3} />
                  {memory.locationName}
                </button>
              )}
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-lg leading-relaxed">
            {memory.description.split('\n').map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>

          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {memory.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-8">
             <button
              onClick={handleShare}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-sm font-black shadow-lg active:scale-95 transition-transform"
             >
               <Share2 size={18} />
               Share This Moment
             </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
