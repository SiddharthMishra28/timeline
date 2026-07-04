"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, Check, X } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      setAudioBlob(null);
      setRecordingDuration(0);
    }
  };

  const handleCancel = () => {
    setAudioBlob(null);
    setRecordingDuration(0);
  };

  if (audioBlob) {
    return (
      <div className="flex items-center gap-4 bg-primary/10 p-3 rounded-full animate-in fade-in zoom-in duration-300">
        <span className="text-xs font-bold text-primary pl-2">Voice Note ({formatDuration(recordingDuration)})</span>
        <div className="flex gap-2">
          <button onClick={handleConfirm} className="p-2 bg-primary text-primary-foreground rounded-full active:scale-95">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="p-2 bg-muted text-muted-foreground rounded-full active:scale-95">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`flex flex-col items-center gap-1 group`}
    >
      <div className={`p-3 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-foreground group-hover:bg-muted/80'}`}>
        {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
      </div>
      <span className="text-[10px]">{isRecording ? formatDuration(recordingDuration) : "Voice"}</span>
    </button>
  );
}
