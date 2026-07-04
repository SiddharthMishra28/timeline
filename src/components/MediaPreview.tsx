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

  if (attachment.type === 'video') {
    return url ? (
      <video src={url} controls className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-muted animate-pulse" />
    );
  }

  if (attachment.type === 'audio') {
    return url ? (
      <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50 p-4">
        <Music size={32} className="text-indigo-500 mb-2" />
        <audio src={url} controls className="w-full h-8" />
      </div>
    ) : (
      <div className="w-full h-full bg-muted animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-2">
      <FileText size={24} />
      <span className="text-[10px] text-center line-clamp-1 mt-1">{attachment.fileName}</span>
    </div>
  );
}
