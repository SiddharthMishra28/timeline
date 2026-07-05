"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { LevelBar } from "@/components/LevelBar";
import { StreakDisplay } from "@/components/StreakDisplay";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Moon,
  Bell,
  Database,
  Trash2,
  Trophy,
  Award,
  Star,
  LogOut,
  Camera,
  Mic,
  MapPin,
  Heart,
} from "lucide-react";

export default function ProfilePage() {
  const { profile, levelInfo } = useGamification();
  const memories = useLiveQuery(() => db.memories.toArray());
  const [activeTab, setActiveTab] = useState<"badges" | "stats" | "settings">("badges");

  const clearAllData = async () => {
    if (confirm("Are you sure? This will delete ALL your memories permanently.")) {
      await db.memories.clear();
      await db.profile.clear();
      await db.pointsLog.clear();
      localStorage.removeItem('lifestream_visited');
      window.location.reload();
    }
  };

  const stats = memories
    ? {
        total: memories.length,
        photos: memories.filter(m => m.attachments.some(a => a.type === 'photo')).length,
        voices: memories.filter(m => m.attachments.some(a => a.type === 'audio')).length,
        achievements: memories.filter(m => m.isAchievement).length,
        favorites: memories.filter(m => m.favorite).length,
        locations: [...new Set(memories.filter(m => m.locationName).map(m => m.locationName))].length,
        moods: [...new Set(memories.filter(m => m.mood).map(m => m.mood))].length,
        tags: [...new Set(memories.flatMap(m => m.tags))].length,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Profile" showSearch={false} />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 mb-20">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <div className="w-24 h-24 energetic-gradient rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl">
            {(profile?.displayName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black">{profile?.displayName || "User"}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              @{profile?.username || "user"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {memories?.length || 0} Memories • Member since {profile?.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : "Today"}
            </p>
          </div>
        </motion.div>

        {/* Level & Streak */}
        {levelInfo && profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <LevelBar
              level={levelInfo.level}
              points={profile.points}
              progress={levelInfo.progress}
            />
            <StreakDisplay streak={profile.streak} />
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 bg-muted rounded-2xl p-1">
          {[
            { id: "badges" as const, label: "Badges", icon: Trophy },
            { id: "stats" as const, label: "Stats", icon: Star },
            { id: "settings" as const, label: "Settings", icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-card shadow-md text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "badges" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Award className="text-primary" size={20} />
              <h3 className="font-black">
                {profile?.badges?.length || 0} / 25 Badges
              </h3>
            </div>
            <BadgeDisplay
              earnedBadges={profile?.badges || []}
              showAll
            />
          </motion.div>
        )}

        {activeTab === "stats" && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="font-black">Your Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Memories", value: stats.total, icon: Database, color: "text-primary" },
                { label: "Photos", value: stats.photos, icon: Camera, color: "text-blue-500" },
                { label: "Voice Notes", value: stats.voices, icon: Mic, color: "text-purple-500" },
                { label: "Achievements", value: stats.achievements, icon: Trophy, color: "text-yellow-500" },
                { label: "Favorites", value: stats.favorites, icon: Heart, color: "text-red-500" },
                { label: "Locations", value: stats.locations, icon: MapPin, color: "text-green-500" },
                { label: "Moods Used", value: stats.moods, icon: Moon, color: "text-indigo-500" },
                { label: "Unique Tags", value: stats.tags, icon: Star, color: "text-orange-500" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-4"
                >
                  <stat.icon size={20} className={stat.color} />
                  <p className="text-2xl font-black mt-2">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-bold">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-muted-foreground" />
                  <span className="text-sm font-bold">Appearance</span>
                </div>
                <span className="text-xs text-muted-foreground">System</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-muted-foreground" />
                  <span className="text-sm font-bold">Privacy Lock</span>
                </div>
                <span className="text-xs text-muted-foreground">Off</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-muted-foreground" />
                  <span className="text-sm font-bold">Notifications</span>
                </div>
                <span className="text-xs text-muted-foreground">Off</span>
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                  <Database size={20} className="text-muted-foreground" />
                  <span className="text-sm font-bold">Export Data</span>
                </div>
              </button>
              <button
                onClick={clearAllData}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 size={20} />
                  <span className="text-sm font-bold">Clear All Data</span>
                </div>
              </button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
              LifeStream v2.0.0<br />
              Your data is stored locally on this device.
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
