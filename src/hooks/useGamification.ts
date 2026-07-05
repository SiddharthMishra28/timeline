"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
  UserProfile,
  POINTS,
  calculateLevel,
  calculateBadges,
  createDefaultProfile,
  BADGES,
} from '@/lib/gamification';

export function useGamification() {
  const profile = useLiveQuery(() => db.profile.toCollection().first());
  const memories = useLiveQuery(() => db.memories.toArray());
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [pointsPopup, setPointsPopup] = useState<{ points: number; action: string } | null>(null);

  // Initialize profile if it doesn't exist
  useEffect(() => {
    if (profile === undefined) return; // Still loading
    if (profile === null) {
      db.profile.add(createDefaultProfile());
    }
  }, [profile]);

  // Update streak
  useEffect(() => {
    if (!profile || !memories) return;

    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = profile.streak;

    if (profile.lastActiveDate === yesterday) {
      newStreak = profile.streak + 1;
    } else if (profile.lastActiveDate !== today) {
      newStreak = 1;
    }

    // Check streak bonus
    if (newStreak > 0 && newStreak % 7 === 0) {
      addPoints('STREAK_BONUS');
    }

    db.profile.update(1!, {
      streak: newStreak,
      lastActiveDate: today,
    });
  }, [profile, memories]);

  // Recalculate badges when memories change
  useEffect(() => {
    if (!profile || !memories) return;

    const allLocations = memories.filter(m => m.locationName).map(m => m.locationName!);
    const uniqueLocations = [...new Set(allLocations)];
    const allMoods = memories.filter(m => m.mood).map(m => m.mood!);
    const uniqueMoods = [...new Set(allMoods)];
    const allTags = memories.flatMap(m => m.tags);
    const uniqueTags = [...new Set(allTags)];

    const earned = calculateBadges({
      totalMemories: profile.totalMemories,
      totalPhotos: profile.totalPhotos,
      totalVoices: profile.totalVoices,
      totalAchievements: profile.totalAchievements,
      streak: profile.streak,
      badges: profile.badges,
      locations: uniqueLocations,
      moods: uniqueMoods,
      tags: uniqueTags,
    });

    // Check for new badges
    const newBadges = earned.filter(b => !profile.badges.includes(b));
    if (newBadges.length > 0) {
      setNewBadge(newBadges[0]);
      setTimeout(() => setNewBadge(null), 3000);
    }

    const { level } = calculateLevel(profile.points);
    db.profile.update(1!, {
      badges: earned,
      level,
    });
  }, [memories, profile]);

  const addPoints = useCallback(async (actionKey: string, memoryId?: number) => {
    const action = POINTS[actionKey];
    if (!action) return;

    const currentProfile = await db.profile.toCollection().first();
    if (!currentProfile) return;

    const newPoints = currentProfile.points + action.points;
    const { level } = calculateLevel(newPoints);

    await db.profile.update(1!, {
      points: newPoints,
      level,
    });

    await db.pointsLog.add({
      action: action.action,
      points: action.points,
      timestamp: Date.now(),
      memoryId,
    });

    setPointsPopup({ points: action.points, action: action.description });
    setTimeout(() => setPointsPopup(null), 2000);
  }, []);

  const recordMemory = useCallback(async (memoryData: {
    hasPhoto?: boolean;
    hasVoice?: boolean;
    hasLocation?: boolean;
    hasTags?: boolean;
    isAchievement?: boolean;
  }) => {
    const currentProfile = await db.profile.toCollection().first();
    if (!currentProfile) return;

    const updates: Partial<UserProfile> = {
      totalMemories: currentProfile.totalMemories + 1,
    };

    if (memoryData.hasPhoto) updates.totalPhotos = currentProfile.totalPhotos + 1;
    if (memoryData.hasVoice) updates.totalVoices = currentProfile.totalVoices + 1;
    if (memoryData.isAchievement) updates.totalAchievements = currentProfile.totalAchievements + 1;

    await db.profile.update(1!, updates);

    // Award points
    addPoints('CREATE_MEMORY');
    if (memoryData.hasPhoto) addPoints('ADD_PHOTO');
    if (memoryData.hasVoice) addPoints('ADD_VOICE');
    if (memoryData.hasLocation) addPoints('ADD_LOCATION');
    if (memoryData.hasTags) addPoints('ADD_TAGS');
    if (memoryData.isAchievement) addPoints('MARK_ACHIEVEMENT');

    // Milestone checks
    const total = updates.totalMemories || currentProfile.totalMemories;
    if (total === 1) addPoints('FIRST_MEMORY');
    if (total === 10) addPoints('TENTH_MEMORY');
    if (total === 50) addPoints('FIFTY_MEMORY');
    if (total === 100) addPoints('HUNDRED_MEMORY');
  }, [addPoints]);

  const levelInfo = profile ? calculateLevel(profile.points) : null;

  return {
    profile,
    memories,
    levelInfo,
    newBadge,
    pointsPopup,
    addPoints,
    recordMemory,
    BADGES,
  };
}
