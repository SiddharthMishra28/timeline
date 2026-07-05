"use client";

import { motion } from 'framer-motion';
import { BADGES, Badge } from '@/lib/gamification';
import { Trophy, Lock } from 'lucide-react';

interface BadgeDisplayProps {
  earnedBadges: string[];
  showAll?: boolean;
}

export function BadgeDisplay({ earnedBadges, showAll = false }: BadgeDisplayProps) {
  const badges = showAll ? BADGES : BADGES.filter(b => earnedBadges.includes(b.id));
  const earned = new Set(earnedBadges);

  if (badges.length === 0 && !showAll) {
    return (
      <div className="text-center py-8">
        <Trophy size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">No badges yet</p>
        <p className="text-xs text-muted-foreground">Start creating memories to earn badges!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {badges.map((badge, i) => {
        const isEarned = earned.has(badge.id);
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all ${
              isEarned
                ? 'bg-card border-border shadow-md'
                : 'bg-muted/50 border-border/50 opacity-50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                isEarned ? 'shadow-lg' : 'grayscale'
              }`}
              style={{ backgroundColor: isEarned ? badge.color + '20' : undefined }}
            >
              {badge.icon}
            </div>
            <p className="text-[10px] font-bold text-center leading-tight">{badge.name}</p>
            {!isEarned && showAll && (
              <Lock size={10} className="absolute top-2 right-2 text-muted-foreground" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export function BadgeCard({ badge, isEarned }: { badge: Badge; isEarned: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-2xl border ${
        isEarned ? 'bg-card border-border' : 'bg-muted/30 border-border/50 opacity-60'
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: isEarned ? badge.color + '20' : undefined }}
      >
        {isEarned ? badge.icon : '🔒'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{badge.name}</p>
        <p className="text-[10px] text-muted-foreground">{badge.description}</p>
      </div>
      {isEarned && (
        <div className="text-[10px] font-black text-primary uppercase">Earned</div>
      )}
    </motion.div>
  );
}
