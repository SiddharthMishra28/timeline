export type Mood = 'happy' | 'neutral' | 'sad' | 'excited' | 'peaceful' | 'reflective';

export type AttachmentType = 'photo' | 'video' | 'audio' | 'file';

export interface Attachment {
  id: string;
  type: AttachmentType;
  blob: Blob;
  fileName: string;
  mimeType: string;
  size: number;
  duration?: number;
  previewUrl?: string;
}

export interface MemoryEntry {
  id?: number;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  eventDateTime: number;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mood?: Mood;
  category?: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  attachments: Attachment[];
  isAchievement: boolean;
  reactions: string[]; // Emoji reactions
}

export interface UserSettings {
  id: number;
  theme: 'light' | 'dark' | 'system';
  privacyLockEnabled: boolean;
  autoLocationTagging: boolean;
}

export interface UserProfile {
  id?: number;
  username: string;
  displayName: string;
  points: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  totalMemories: number;
  totalPhotos: number;
  totalVoices: number;
  totalAchievements: number;
  joinedAt: number;
}

export interface PointsLog {
  id?: number;
  action: string;
  points: number;
  timestamp: number;
  memoryId?: number;
}
