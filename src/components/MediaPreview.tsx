"use client";

import { Attachment } from "@/types";
import { useMediaUrl } from "@/hooks/useMediaUrl";
import Image from "next/image";
import { FileText, Music, Video } from "lucide-react";

export function MediaPreview({ attachment }: { attachment: Attachment }) {
  const url = useMediaUrl(attachment);

  if (attachment.type === 'photo') {
    return url ? (
      <Image src={url} alt={attachment.fileName} fill className="object-cover" unoptimized />
    ) : (
      <div className="w-full h-full bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-2">
      {attachment.type === 'video' && <Video size={24} />}
      {attachment.type === 'audio' && <Music size={24} />}
      {attachment.type === 'file' && <FileText size={24} />}
      <span className="text-[10px] text-center line-clamp-1 mt-1">{attachment.fileName}</span>
    </div>
  );
}
