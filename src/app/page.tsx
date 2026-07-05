"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { TimelineCard } from "@/components/TimelineCard";
import { BottomNav } from "@/components/BottomNav";
import { CaptureFAB } from "@/components/CaptureFAB";
import { AppHeader } from "@/components/AppHeader";
import { StoryReel } from "@/components/StoryReel";
import { LevelBar } from "@/components/LevelBar";
import { StreakDisplay } from "@/components/StreakDisplay";
import { PointsPopup } from "@/components/PointsPopup";
import { NewBadgePopup } from "@/components/PointsPopup";
import { Onboarding } from "@/components/Onboarding";
import { seedDemoData } from "@/lib/demo-data";
import { useGamification } from "@/hooks/useGamification";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, BookOpen, Calendar, Zap } from "lucide-react";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const { profile, memories, levelInfo, newBadge, pointsPopup } = useGamification();

  const pinnedMemories = useLiveQuery(() => db.memories.where('pinned').equals(1).toArray());
  const [isReelOpen, setIsReelOpen] = useState(false);

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('lifestream_visited');
    if (!hasVisited && profile === null) {
      setShowOnboarding(true);
    } else {
      setOnboardingComplete(true);
    }
  }, [profile]);

  // Seed demo data on first visit
  useEffect(() => {
    if (onboardingComplete) {
      seedDemoData().then(() => {
        localStorage.setItem('lifestream_visited', 'true');
      });
    }
  }, [onboardingComplete]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingComplete(true);
    localStorage.setItem('lifestream_visited', 'true');
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!onboardingComplete) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="LifeStream" />

      <div className="max-w-md mx-auto px-4 py-6 space-y-8 mb-20">
        {/* Welcome & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 energetic-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                {profile?.displayName || "Welcome"} ✨
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {memories?.length || 0} memories captured
              </p>
            </div>
          </div>

          {/* Level & Streak */}
          <div className="grid grid-cols-1 gap-3">
            {levelInfo && profile && (
              <LevelBar
                level={levelInfo.level}
                points={profile.points}
                progress={levelInfo.progress}
              />
            )}
            {profile && (
              <StreakDisplay streak={profile.streak} />
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        {memories && memories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-card border border-border rounded-2xl p-3 text-center">
              <TrendingUp size={20} className="text-primary mx-auto mb-1" />
              <p className="text-lg font-black">{memories.length}</p>
              <p className="text-[10px] text-muted-foreground font-bold">Memories</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 text-center">
              <BookOpen size={20} className="text-secondary mx-auto mb-1" />
              <p className="text-lg font-black">
                {memories.filter(m => m.isAchievement).length}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold">Achievements</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-3 text-center">
              <Calendar size={20} className="text-accent mx-auto mb-1" />
              <p className="text-lg font-black">
                {profile?.badges?.length || 0}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold">Badges</p>
            </div>
          </motion.div>
        )}

        {/* Pinned Memories */}
        {pinnedMemories && pinnedMemories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              📌 Pinned
            </h3>
            {pinnedMemories.map(memory => (
              <TimelineCard key={memory.id} memory={memory} />
            ))}
          </motion.section>
        )}

        {/* Recent Memories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Recent Memories
            </h3>
            {memories && memories.length > 3 && (
              <button
                onClick={() => setIsReelOpen(true)}
                className="flex items-center gap-1 text-xs font-bold text-primary"
              >
                <Sparkles size={12} />
                Story Reel
              </button>
            )}
          </div>

          {(!memories || memories.length === 0) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 space-y-4"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 energetic-gradient rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl"
              >
                <Sparkles size={40} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black">
                  Start Your Stream<span className="text-primary">.</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Capture your first memory and begin your journey. Every moment matters.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {memories?.slice(0, 10).map((memory, i) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <TimelineCard memory={memory} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Story Reel */}
      <AnimatePresence>
        {isReelOpen && memories && memories.length > 0 && (
          <StoryReel memories={memories} onClose={() => setIsReelOpen(false)} />
        )}
      </AnimatePresence>

      <CaptureFAB />
      <BottomNav />

      {/* Gamification Popups */}
      <PointsPopup
        points={pointsPopup?.points || 0}
        action={pointsPopup?.action || ''}
        show={!!pointsPopup}
      />
      <NewBadgePopup
        badge={newBadge ? { name: newBadge, icon: '🏆', description: 'New badge earned!' } : null}
        show={!!newBadge}
      />
    </div>
  );
}
