// Gamification engine for LifeStream
// Points, levels, streaks, badges, and achievements

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'social' | 'creative' | 'special';
  requirement: number;
  color: string;
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

export interface PointsAction {
  action: string;
  points: number;
  description: string;
}

// Points system
export const POINTS: Record<string, PointsAction> = {
  CREATE_MEMORY: { action: 'create_memory', points: 10, description: 'Create a memory' },
  ADD_PHOTO: { action: 'add_photo', points: 5, description: 'Add a photo' },
  ADD_VOICE: { action: 'add_voice', points: 8, description: 'Record a voice note' },
  ADD_LOCATION: { action: 'add_location', points: 3, description: 'Tag a location' },
  ADD_TAGS: { action: 'add_tags', points: 2, description: 'Add tags' },
  MARK_ACHIEVEMENT: { action: 'mark_achievement', points: 20, description: 'Mark as achievement' },
  DAILY_LOGIN: { action: 'daily_login', points: 5, description: 'Daily login' },
  STREAK_BONUS: { action: 'streak_bonus', points: 10, description: 'Streak bonus' },
  FIRST_MEMORY: { action: 'first_memory', points: 100, description: 'First memory ever' },
  TENTH_MEMORY: { action: 'tenth_memory', points: 50, description: '10 memories milestone' },
  FIFTY_MEMORY: { action: 'fifty_memory', points: 100, description: '50 memories milestone' },
  HUNDRED_MEMORY: { action: 'hundred_memory', points: 500, description: '100 memories milestone' },
  REACTION: { action: 'reaction', points: 1, description: 'React to a memory' },
  FAVORITE: { action: 'favorite', points: 2, description: 'Favorite a memory' },
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  50,     // Level 2
  150,    // Level 3
  300,    // Level 4
  500,    // Level 5
  800,    // Level 6
  1200,   // Level 7
  1800,   // Level 8
  2500,   // Level 9
  3500,   // Level 10
  5000,   // Level 11
  7000,   // Level 12
  10000,  // Level 13
  15000,  // Level 14
  20000,  // Level 15
  30000,  // Level 16
  45000,  // Level 17
  65000,  // Level 18
  90000,  // Level 19
  120000, // Level 20
];

export const LEVEL_NAMES = [
  'Newcomer',        // 1
  'Observer',        // 2
  'Recorder',        // 3
  'Storyteller',     // 4
  'Chronicler',      // 5
  'Historian',       // 6
  'Archivist',       // 7
  'Luminary',        // 8
  'Legend',          // 9
  'Timeless',        // 10
  'Eternal',         // 11
  'Transcendent',    // 12
  'Omniscient',      // 13
  'Immortal',        // 14
  'Celestial',       // 15
  'Divine',          // 16
  'Cosmic',          // 17
  'Infinite',        // 18
  'Absolute',        // 19
  'Omega',           // 20
];

// All badges
export const BADGES: Badge[] = [
  // Milestone badges
  { id: 'first_memory', name: 'First Light', description: 'Created your first memory', icon: '✨', category: 'milestone', requirement: 1, color: '#FFD700' },
  { id: 'memories_10', name: 'Collector', description: 'Captured 10 memories', icon: '📸', category: 'milestone', requirement: 10, color: '#FF6B6B' },
  { id: 'memories_25', name: 'Hoarder', description: '25 memories and counting', icon: '📦', category: 'milestone', requirement: 25, color: '#4ECDC4' },
  { id: 'memories_50', name: 'Archive Master', description: '50 memories archived', icon: '🏛️', category: 'milestone', requirement: 50, color: '#45B7D1' },
  { id: 'memories_100', name: 'Century Club', description: '100 memories captured', icon: '💯', category: 'milestone', requirement: 100, color: '#96CEB4' },
  { id: 'memories_250', name: 'Living Library', description: '250 memories - a living library', icon: '📚', category: 'milestone', requirement: 250, color: '#DDA0DD' },
  { id: 'memories_500', name: 'Memory Titan', description: '500 memories - truly epic', icon: '🏔️', category: 'milestone', requirement: 500, color: '#FF8C00' },

  // Streak badges
  { id: 'streak_3', name: 'On Fire', description: '3-day streak', icon: '🔥', category: 'streak', requirement: 3, color: '#FF4500' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚡', category: 'streak', requirement: 7, color: '#FFD700' },
  { id: 'streak_14', name: 'Dedicated', description: '14-day streak', icon: '💎', category: 'streak', requirement: 14, color: '#00BFFF' },
  { id: 'streak_30', name: 'Unstoppable', description: '30-day streak', icon: '🌟', category: 'streak', requirement: 30, color: '#FF69B4' },
  { id: 'streak_100', name: 'Legend', description: '100-day streak', icon: '👑', category: 'streak', requirement: 100, color: '#FFD700' },

  // Creative badges
  { id: 'first_photo', name: 'Shutterbug', description: 'Added your first photo', icon: '📷', category: 'creative', requirement: 1, color: '#FF6B6B' },
  { id: 'photos_50', name: 'Photographer', description: '50 photos captured', icon: '📸', category: 'creative', requirement: 50, color: '#4ECDC4' },
  { id: 'first_voice', name: 'Voice Actor', description: 'Recorded your first voice note', icon: '🎙️', category: 'creative', requirement: 1, color: '#9B59B6' },
  { id: 'first_achievement', name: 'Achiever', description: 'Marked first achievement', icon: '🏆', category: 'creative', requirement: 1, color: '#FFD700' },
  { id: 'achievements_10', name: 'Overachiever', description: '10 achievements unlocked', icon: '🥇', category: 'creative', requirement: 10, color: '#FFD700' },

  // Social badges
  { id: 'first_reaction', name: 'Friendly', description: 'Reacted to a memory', icon: '👍', category: 'social', requirement: 1, color: '#4CAF50' },
  { id: 'reactions_100', name: 'Social Butterfly', description: '100 reactions given', icon: '🦋', category: 'social', requirement: 100, color: '#E91E63' },

  // Special badges
  { id: 'night_owl', name: 'Night Owl', description: 'Created a memory after midnight', icon: '🦉', category: 'special', requirement: 1, color: '#2C3E50' },
  { id: 'early_bird', name: 'Early Bird', description: 'Created a memory before 6 AM', icon: '🐦', category: 'special', requirement: 1, color: '#F39C12' },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Created 5 memories on a weekend', icon: '⚔️', category: 'special', requirement: 5, color: '#E74C3C' },
  { id: 'globetrotter', name: 'Globetrotter', description: 'Memories from 5+ locations', icon: '🌍', category: 'special', requirement: 5, color: '#3498DB' },
  { id: 'mood_master', name: 'Mood Master', description: 'Used all 6 mood types', icon: '🎭', category: 'special', requirement: 6, color: '#9B59B6' },
  { id: 'tag_titan', name: 'Tag Titan', description: 'Used 20+ unique tags', icon: '🏷️', category: 'special', requirement: 20, color: '#1ABC9C' },
];

// Calculate level from points
export function calculateLevel(points: number): { level: number; name: string; progress: number; nextLevel: number } {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 1.5;
  const progress = Math.min(1, (points - currentThreshold) / (nextThreshold - currentThreshold));

  return {
    level,
    name: LEVEL_NAMES[level - 1] || `Level ${level}`,
    progress,
    nextLevel: nextThreshold,
  };
}

// Get earned badges from memory data
export function calculateBadges(profile: {
  totalMemories: number;
  totalPhotos: number;
  totalVoices: number;
  totalAchievements: number;
  streak: number;
  badges: string[];
  locations?: string[];
  moods?: string[];
  tags?: string[];
}): string[] {
  const earned = new Set<string>();

  // Milestone badges
  if (profile.totalMemories >= 1) earned.add('first_memory');
  if (profile.totalMemories >= 10) earned.add('memories_10');
  if (profile.totalMemories >= 25) earned.add('memories_25');
  if (profile.totalMemories >= 50) earned.add('memories_50');
  if (profile.totalMemories >= 100) earned.add('memories_100');
  if (profile.totalMemories >= 250) earned.add('memories_250');
  if (profile.totalMemories >= 500) earned.add('memories_500');

  // Streak badges
  if (profile.streak >= 3) earned.add('streak_3');
  if (profile.streak >= 7) earned.add('streak_7');
  if (profile.streak >= 14) earned.add('streak_14');
  if (profile.streak >= 30) earned.add('streak_30');
  if (profile.streak >= 100) earned.add('streak_100');

  // Creative badges
  if (profile.totalPhotos >= 1) earned.add('first_photo');
  if (profile.totalPhotos >= 50) earned.add('photos_50');
  if (profile.totalVoices >= 1) earned.add('first_voice');
  if (profile.totalAchievements >= 1) earned.add('first_achievement');
  if (profile.totalAchievements >= 10) earned.add('achievements_10');

  // Special badges
  if (profile.locations && profile.locations.length >= 5) earned.add('globetrotter');
  if (profile.moods && profile.moods.length >= 6) earned.add('mood_master');
  if (profile.tags && profile.tags.length >= 20) earned.add('tag_titan');

  return Array.from(earned);
}

// Generate default user profile
export function createDefaultProfile(): UserProfile {
  return {
    username: 'memory_maker',
    displayName: 'Memory Maker',
    points: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badges: [],
    totalMemories: 0,
    totalPhotos: 0,
    totalVoices: 0,
    totalAchievements: 0,
    joinedAt: Date.now(),
  };
}
