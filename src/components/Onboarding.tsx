"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Camera, Mic, Trophy, ArrowRight, ChevronLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { createDefaultProfile } from '@/lib/gamification';

const steps = [
  {
    icon: Zap,
    title: "Welcome to LifeStream",
    subtitle: "Your life, beautifully captured",
    description: "Capture memories, track your journey, and unlock achievements along the way.",
    gradient: "energetic-gradient",
    color: "text-white",
  },
  {
    icon: Camera,
    title: "Capture Moments",
    subtitle: "Photos, videos, voice notes",
    description: "Snap photos, record voice notes, or attach files to bring your memories to life.",
    gradient: "secondary-gradient",
    color: "text-white",
  },
  {
    icon: Trophy,
    title: "Earn & Level Up",
    subtitle: "Gamified experience",
    description: "Earn points for every memory, unlock badges, and watch your level grow.",
    gradient: "energetic-gradient",
    color: "text-white",
  },
  {
    icon: Zap,
    title: "Ready to Start?",
    subtitle: "Let's create your first memory",
    description: "Your journey begins now. Every moment matters.",
    gradient: "secondary-gradient",
    color: "text-white",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    // Create profile
    const profile = createDefaultProfile();
    profile.displayName = displayName || 'Memory Maker';
    profile.username = displayName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'memory_maker';
    await db.profile.add(profile);
    onComplete();
  };

  const current = steps[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-24 h-24 ${current.gradient} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl`}
          >
            <current.icon size={48} className={current.color} />
          </motion.div>

          <h1 className="text-4xl font-black tracking-tighter mb-2">
            {current.title}<span className="text-primary">.</span>
          </h1>
          <p className="text-lg font-bold text-primary mb-4">{current.subtitle}</p>
          <p className="text-sm text-muted-foreground max-w-xs">{current.description}</p>

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 w-full max-w-xs"
            >
              <input
                type="text"
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-muted border-none rounded-2xl py-4 px-6 text-center text-sm font-bold focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="p-8 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 text-muted-foreground font-bold text-sm"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        ) : (
          <div />
        )}

        {/* Dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1 text-primary font-bold text-sm"
          >
            Next
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="flex items-center gap-1 energetic-gradient text-white px-6 py-3 rounded-full font-black text-sm shadow-xl active:scale-95"
          >
            {isFinishing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Let's Go
                <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
