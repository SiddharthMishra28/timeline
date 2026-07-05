"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/db";
import { Attachment, AttachmentType, Mood } from "@/types";
import { Camera, Image as ImageIcon, Mic, MapPin, X, ChevronLeft, Paperclip, Sparkles, Smile, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { MediaPreview } from "@/components/MediaPreview";
import { AudioRecorder } from "@/components/AudioRecorder";

export default function EditMemoryClient() {
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.memories.update(id, {
        title, description, updatedAt: Date.now(),
        eventDateTime: new Date(date).getTime(),
        locationName, mood,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ""),
        isAchievement, attachments
      });
      router.push(`/memory/${id}`);
    } catch (error) {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold">Edit Memory</h1>
        <button onClick={handleSave} disabled={isSaving} className="text-primary font-bold disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : "Save"}
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-6">
        <input type="text" placeholder="What happened?" className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Add more details..." className="w-full h-32 bg-transparent border-none focus:ring-0 p-0 resize-none placeholder:text-muted-foreground" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar size={20} />
            <input type="datetime-local" className="bg-transparent border-none p-0 text-sm focus:ring-0" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin size={20} />
            <input type="text" placeholder="Add location" className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Smile size={20} />
            <select className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
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
            <input type="text" placeholder="Add tags (comma separated)" className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex items-center justify-between py-2 px-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
             <div className="flex items-center gap-3 text-yellow-600">
                <Sparkles size={20} />
                <span className="text-sm font-bold">Mark as Achievement</span>
             </div>
             <input type="checkbox" className="w-5 h-5 rounded border-yellow-500 text-yellow-500 focus:ring-yellow-500" checked={isAchievement} onChange={(e) => setIsAchievement(e.target.checked)} />
          </div>
        </div>
      </div>
    </div>
  );
}
