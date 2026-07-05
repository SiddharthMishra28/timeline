"use client";

import { motion } from 'framer-motion';
import { LEVEL_NAMES } from '@/lib/gamification';
import { Star } from 'lucide-react';

interface LevelBarProps {
  level: number;
  points: number;
  progress: number;
  compact?: boolean;
}

export function LevelBar({ level, points, progress, compact = false }: LevelBarProps) {
  const levelName = LEVEL_NAMES[level - 1] || `Level ${level}`;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Star size={16} className="text-primary" fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-primary">Lv.{level}</span>
            <span className="text-muted-foreground">{points} pts</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full energetic-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 energetic-gradient rounded-2xl flex items-center justify-center shadow-lg">
          <Star size={28} className="text-white" fill="currentColor" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black">{level}</h3>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Level {level}</p>
              <p className="text-sm font-bold text-muted-foreground">{levelName}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary">{points}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">points</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-bold mb-1">
          <span>Progress to Level {level + 1}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full energetic-gradient rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
