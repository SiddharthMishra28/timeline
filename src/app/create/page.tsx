"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { Attachment, AttachmentType, Mood } from "@/types";
import {
  Camera,
  Image as ImageIcon,
  Mic,
  MapPin,
  X,
  Save,
  ChevronLeft,
  Paperclip,
  Sparkles,
  Smile,
  Calendar,
  Loader2,
  Trophy,
  Flame,
  Users,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { MediaPreview } from "@/components/MediaPreview";
import { AudioRecorder } from "@/components/AudioRecorder";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";

export default function CreateMemory() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mood, setMood] = useState<Mood>("neutral");
  const [tags, setTags] = useState("");
  const [isAchievement, setIsAchievement] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { recordMemory } = useGamification();

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

  const handleAudioComplete = (blob: Blob) => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36).substring(7),
      type: 'audio',
      blob: blob,
      fileName: `voice-note-${Date.now()}.webm`,
      mimeType: blob.type,
      size: blob.size,
      previewUrl: URL.createObjectURL(blob)
    };
    setAttachments(prev => [...prev, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      const removed = prev.find(a => a.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // Reverse geocoding placeholder
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          if (data.display_name) {
            setLocationName(data.address.city || data.address.town || data.address.village || data.display_name.split(',')[0]);
          }
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error", error);
        setIsGettingLocation(false);
        alert("Could not get location. Please enter it manually.");
      }
    );
  };

  const handleSave = async () => {
    if (!title && !description && attachments.length === 0) return;

    setIsSaving(true);
    try {
      await db.memories.add({
        title,
        description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        eventDateTime: new Date(date).getTime(),
        locationName,
        latitude,
        longitude,
        mood,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== ""),
        isAchievement,
        reactions: [],
        pinned: false,
        favorite: false,
        attachments: attachments.map(a => ({
          ...a,
          // We keep the blob in indexedDB
        }))
      });

      // Record gamification points
      await recordMemory({
        hasPhoto: attachments.some(a => a.type === 'photo'),
        hasVoice: attachments.some(a => a.type === 'audio'),
        hasLocation: !!locationName,
        hasTags: tags.split(',').filter(t => t.trim()).length > 0,
        isAchievement,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to save memory:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex justify-between items-center">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">New Memory</h1>
        <button
          onClick={handleSave}
          disabled={isSaving || (!title && !description && attachments.length === 0)}
          className="text-primary font-bold disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : "Save"}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full space-y-6">
        {/* Title Input */}
        <input
          type="text"
          placeholder="What happened?"
          className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-muted-foreground"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description Input */}
        <textarea
          placeholder="Add more details..."
          className="w-full h-32 bg-transparent border-none focus:ring-0 p-0 resize-none placeholder:text-muted-foreground"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Media Preview Area */}
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

        {/* Metadata Controls */}
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
            <button
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="text-[10px] bg-muted px-2 py-1 rounded-md shrink-0 active:scale-95"
            >
              {isGettingLocation ? "..." : "Current"}
            </button>
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

      {/* Quick Capture Bar */}
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
          <AudioRecorder onRecordingComplete={handleAudioComplete} />
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
