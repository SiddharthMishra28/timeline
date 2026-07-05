"use client";

import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  compact?: boolean;
}

export function StreakDisplay({ streak, compact = false }: StreakDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Flame size={16} className="text-orange-500" fill="currentColor" />
        <span className="text-sm font-black text-orange-500">{streak}</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <motion.div
          animate={streak > 0 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center"
        >
          <Flame size={28} className="text-orange-500" fill="currentColor" />
        </motion.div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-orange-500">{streak}</span>
            <span className="text-sm font-bold text-muted-foreground">day streak</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {streak === 0 && "Start a streak by logging in daily!"}
            {streak > 0 && streak < 7 && "Keep going! 7 days for a badge"}
            {streak >= 7 && streak < 30 && "You're on fire! 🔥"}
            {streak >= 30 && "Unstoppable! 💪"}
          </p>
        </div>
      </div>
      {streak >= 3 && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < streak % 7 || streak >= 7
                  ? 'bg-orange-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
