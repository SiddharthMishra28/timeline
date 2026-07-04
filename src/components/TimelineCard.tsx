"use client";

import { MemoryEntry } from "@/types";
import { format } from "date-fns";
import { MapPin, Heart, Pin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMediaUrl } from "@/hooks/useMediaUrl";

interface TimelineCardProps {
  memory: MemoryEntry;
}

export function TimelineCard({ memory }: TimelineCardProps) {
  const firstPhoto = memory.attachments.find(a => a.type === 'photo');
  const mediaUrl = useMediaUrl(firstPhoto);

  return (
    <Link href={`/memory/${memory.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border mb-4 active:scale-[0.98] transition-transform">
        {mediaUrl && (
          <div className="relative h-48 w-full bg-muted">
             <Image
              src={mediaUrl}
              alt={memory.title}
              fill
              className="object-cover"
              unoptimized
             />
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold line-clamp-1">{memory.title || "Untitled Moment"}</h3>
            <div className="flex gap-2">
              {memory.pinned && <Pin size={16} className="text-primary fill-primary" />}
              {memory.favorite && <Heart size={16} className="text-red-500 fill-red-500" />}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {memory.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{format(memory.eventDateTime, "MMM d, yyyy • h:mm a")}</span>
            {memory.locationName && (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {memory.locationName}
              </span>
            )}
          </div>

          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {memory.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-muted rounded-full text-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
