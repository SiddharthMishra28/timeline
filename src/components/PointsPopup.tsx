"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface PointsPopupProps {
  points: number;
  action: string;
  show: boolean;
}

export function PointsPopup({ points, action, show }: PointsPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-2xl">
            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="font-black text-lg">+{points}</span>
            <span className="text-sm font-medium opacity-90">{action}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface NewBadgePopupProps {
  badge: { name: string; icon: string; description: string } | null;
  show: boolean;
}

export function NewBadgePopup({ badge, show }: NewBadgePopupProps) {
  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-card border border-border rounded-3xl p-8 mx-6 text-center max-w-sm w-full shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl"
            >
              {badge.icon}
            </motion.div>
            <h2 className="text-2xl font-black mb-2">Badge Unlocked!</h2>
            <h3 className="text-lg font-bold text-primary mb-1">{badge.name}</h3>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="h-1 energetic-gradient rounded-full mt-6"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
