"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/db";
import { Attachment, AttachmentType, Mood, MemoryEntry } from "@/types";
import {
  Camera,
  Image as ImageIcon,
  Mic,
  MapPin,
  X,
  ChevronLeft,
  Paperclip,
  Smile,
  Calendar,
  Loader2,
  Trash2,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { MediaPreview } from "@/components/MediaPreview";

export default function EditMemory() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [mood, setMood] = useState<Mood>("neutral");
  const [tags, setTags] = useState("");
  const [isAchievement, setIsAchievement] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadMemory() {
      const memory = await db.memories.get(id);
      if (memory) {
        setTitle(memory.title);
        setDescription(memory.description);
        setDate(format(memory.eventDateTime, "yyyy-MM-dd'T'HH:mm"));
        setLocationName(memory.locationName || "");
        setMood(memory.mood || "neutral");
        setTags(memory.tags.join(", "));
        setIsAchievement(memory.isAchievement || false);
        setAttachments(memory.attachments || []);
      }
      setIsLoading(false);
    }
    loadMemory();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const type: AttachmentType = file.type.startsWith('image/') ? 'photo' :
                                   file.type.startsWith('video/') ? 'video' :
                                   file.type.startsWith('audio/') ? 'audio' : 'file';

      const newAttachment: Attachment = {
        id: Math.random().toString(36).substring(7),
        type,
        blob: file,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        previewUrl: URL.createObjectURL(file)
      };

      setAttachments(prev => [...prev, newAttachment]);
    });
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== attachmentId);
      const removed = prev.find(a => a.id === attachmentId);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this memory?")) {
      await db.memories.delete(id);
      router.push("/");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.memories.update(id, {
        title,
        description,
        updatedAt: Date.now(),
        eventDateTime: new Date(date).getTime(),
        locationName,
        mood,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ""),
        isAchievement,
        attachments
      });
      router.push(`/memory/${id}`);
    } catch (error) {
      console.error("Failed to update memory:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Edit Memory</h1>
        <div className="flex gap-2">
           <button onClick={handleDelete} className="p-2 text-muted-foreground">
             <Trash2 size={20} />
           </button>
           <button
             onClick={handleSave}
             disabled={isSaving}
             className="text-primary font-bold disabled:opacity-50"
           >
             {isSaving ? <Loader2 className="animate-spin" size={20} /> : "Save"}
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-6">
        <input
          type="text"
          placeholder="What happened?"
          className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Add more details..."
          className="w-full h-32 bg-transparent border-none focus:ring-0 p-0 resize-none placeholder:text-muted-foreground"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                <MediaPreview attachment={attachment} />
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar size={20} />
            <input
              type="datetime-local"
              className="bg-transparent border-none p-0 text-sm focus:ring-0"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin size={20} />
            <input
              type="text"
              placeholder="Add location"
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Smile size={20} />
            <select
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full"
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood)}
            >
              <option value="neutral">Neutral</option>
              <option value="happy">Happy</option>
              <option value="excited">Excited</option>
              <option value="peaceful">Peaceful</option>
              <option value="reflective">Reflective</option>
              <option value="sad">Sad</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-lg font-bold">#</span>
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between py-2 px-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
             <div className="flex items-center gap-3 text-yellow-600">
                <Sparkles size={20} />
                <span className="text-sm font-bold">Mark as Achievement</span>
             </div>
             <input
                type="checkbox"
                className="w-5 h-5 rounded border-yellow-500 text-yellow-500 focus:ring-yellow-500"
                checked={isAchievement}
                onChange={(e) => setIsAchievement(e.target.checked)}
             />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <div className="max-w-md mx-auto flex justify-around">
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="p-3 bg-muted rounded-full">
              <Camera size={24} />
            </div>
            <span className="text-[10px]">Photo</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="p-3 bg-muted rounded-full">
              <ImageIcon size={24} />
            </div>
            <span className="text-[10px]">Gallery</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
            <div className="p-3 bg-muted rounded-full">
              <Mic size={24} />
            </div>
            <span className="text-[10px]">Voice</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="p-3 bg-muted rounded-full">
              <Paperclip size={24} />
            </div>
            <span className="text-[10px]">File</span>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
}
