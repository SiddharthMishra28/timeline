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

export default function MemoryDetail() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const memory = useLiveQuery(() => db.memories.get(id));

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
          <div className="w-full bg-muted aspect-[4/3] relative overflow-hidden">
            {memory.attachments.filter(a => a.type === 'photo').map((attachment) => (
              <MediaPreview key={attachment.id} attachment={attachment} />
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold">{memory.title || "Untitled Moment"}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {format(memory.eventDateTime, "PPPP 'at' p")}
              </span>
              {memory.locationName && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {memory.locationName}
                </span>
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
             <button className="flex items-center gap-2 px-6 py-3 bg-muted rounded-full text-sm font-bold">
               <Share2 size={18} />
               Share Memory
             </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
