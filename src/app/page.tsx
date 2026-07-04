"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { TimelineCard } from "@/components/TimelineCard";
import { BottomNav } from "@/components/BottomNav";
import { CaptureFAB } from "@/components/CaptureFAB";
import { AppHeader } from "@/components/AppHeader";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
          </div>
        ) : (
          <div className="space-y-2">
            {memories.map((memory) => (
              <TimelineCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}
      </div>

      <CaptureFAB />
      <BottomNav />
    </div>
  );
}
