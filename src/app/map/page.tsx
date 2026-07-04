"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { MapPin, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMediaUrl } from "@/hooks/useMediaUrl";
import Image from "next/image";

function MapMarkerCard({ memory }: { memory: any }) {
  const firstPhoto = memory.attachments.find((a: any) => a.type === 'photo');
  const mediaUrl = useMediaUrl(firstPhoto);

  return (
    <Link
      href={`/memory/${memory.id}`}
      className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-md active:scale-[0.98] transition-transform w-48 shrink-0"
    >
      {mediaUrl ? (
        <div className="relative h-24 w-full">
          <Image src={mediaUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="h-24 w-full bg-primary/10 flex items-center justify-center text-primary">
           <MapPin size={24} />
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-bold truncate">{memory.title || "Untitled"}</p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
          <MapPin size={10} /> {memory.locationName}
        </p>
        <div className="flex items-center justify-between">
           <span className="text-[10px] text-muted-foreground">{new Date(memory.eventDateTime).toLocaleDateString()}</span>
           <ArrowRight size={12} className="text-primary" />
        </div>
      </div>
    </Link>
  );
}

export default function MapPage() {
  const memoriesWithLocation = useLiveQuery(async () => {
    const all = await db.memories.toArray();
    return all.filter(m => m.locationName && m.locationName.trim() !== "");
  });

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen overflow-hidden">
      <AppHeader title="Memory Map" />

      <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 overflow-hidden flex flex-col">
        {/* Visual Map Representation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
           <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat bg-contain" />
        </div>

        {/* Floating Markers (Simulated) */}
        <div className="relative flex-1 p-8 overflow-y-auto">
          {memoriesWithLocation === undefined ? (
             <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : memoriesWithLocation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                  <MapPin size={32} />
               </div>
               <p className="text-muted-foreground max-w-xs">Capture memories with locations to see them here.</p>
            </div>
          ) : (
            <div className="space-y-8">
               <div className="flex items-center gap-2 text-primary font-bold">
                  <MapPin size={20} />
                  <span>Your Memories around the World</span>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memoriesWithLocation.map(memory => (
                     <div key={memory.id} className="flex gap-4">
                        <MapMarkerCard memory={memory} />
                        <div className="flex-1 hidden sm:block">
                           <p className="text-xs text-muted-foreground line-clamp-4">{memory.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Horizontal Scroll Area for quick access if needed */}
        {memoriesWithLocation && memoriesWithLocation.length > 0 && (
           <div className="bg-background/80 backdrop-blur-md border-t border-border p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">Recent Locations</p>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                 {memoriesWithLocation.slice(0, 5).map(m => (
                    <MapMarkerCard key={m.id} memory={m} />
                 ))}
              </div>
           </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
