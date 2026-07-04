"use client";

import { MemoryEntry } from "@/types";
import { MediaPreview } from "./MediaPreview";
import { motion } from "framer-motion";

export function MemoryCollage({ memories }: { memories: MemoryEntry[] }) {
  if (memories.length === 0) return null;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-1 h-48 rounded-2xl overflow-hidden bg-muted border border-border">
      <div className="col-span-2 row-span-2 relative">
        {memories[0]?.attachments.find(a => a.type === 'photo') ? (
          <MediaPreview attachment={memories[0].attachments.find(a => a.type === 'photo')!} />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center p-4 text-center">
             <span className="text-[10px] font-bold text-primary">{memories[0]?.title}</span>
          </div>
        )}
      </div>
      <div className="col-span-2 row-span-1 relative">
        {memories[1]?.attachments.find(a => a.type === 'photo') ? (
          <MediaPreview attachment={memories[1].attachments.find(a => a.type === 'photo')!} />
        ) : (
          <div className="w-full h-full bg-secondary/10 flex items-center justify-center p-4 text-center">
             <span className="text-[10px] font-bold text-secondary-foreground">{memories[1]?.title}</span>
          </div>
        )}
      </div>
      <div className="col-span-1 row-span-1 relative">
        {memories[2]?.attachments.find(a => a.type === 'photo') ? (
          <MediaPreview attachment={memories[2].attachments.find(a => a.type === 'photo')!} />
        ) : (
          <div className="w-full h-full bg-accent/10 flex items-center justify-center" />
        )}
      </div>
      <div className="col-span-1 row-span-1 relative bg-black/80 flex items-center justify-center">
        <span className="text-white text-xs font-bold">+{memories.length > 3 ? memories.length - 3 : 0}</span>
      </div>
    </div>
  );
}
