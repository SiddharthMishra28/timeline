"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { Search as SearchIcon, X, SlidersHorizontal, LayoutGrid, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { TimelineCard } from "@/components/TimelineCard";
import { MemoryCollage } from "@/components/MemoryCollage";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const memories = useLiveQuery(async () => {
    let collection = db.memories.orderBy("eventDateTime").reverse();
    const results = await collection.toArray();

    return results.filter(m => {
      const matchesQuery = !query ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));

      const matchesFilter = !activeFilter ||
        (activeFilter === 'favorite' && m.favorite) ||
        (activeFilter === 'pinned' && m.pinned) ||
        (activeFilter === 'achievement' && m.isAchievement) ||
        (m.mood === activeFilter);

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const filters = [
    { id: 'achievement', label: '🏆 Achievements' },
    { id: 'favorite', label: '❤️ Favorites' },
    { id: 'pinned', label: '📌 Pinned' },
    { id: 'happy', label: '😊 Happy' },
    { id: 'excited', label: '🤩 Excited' },
    { id: 'peaceful', label: '😌 Peaceful' },
    { id: 'reflective', label: '🤔 Reflective' },
    { id: 'sad', label: '😢 Sad' },
  ];

  // Quick stats
  const totalMemories = memories?.length || 0;
  const totalAchievements = memories?.filter(m => m.isAchievement).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Explore" showSearch={false} />

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search moments, tags, places..."
            className="w-full bg-muted border-none rounded-2xl py-4 pl-10 pr-10 focus:ring-2 focus:ring-primary shadow-inner"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-primary/10 rounded-2xl p-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-xs font-bold">{totalMemories} memories</span>
          </div>
          <div className="flex-1 bg-yellow-500/10 rounded-2xl p-3 flex items-center gap-2">
            <LayoutGrid size={16} className="text-yellow-600" />
            <span className="text-xs font-bold">{totalAchievements} achievements</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map(f => (
             <button
               key={f.id}
               onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
               className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                 activeFilter === f.id ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-muted text-muted-foreground'
               }`}
             >
               {f.label}
             </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-6 mb-20">
           {/* Summary Collage Section */}
           {!query && !activeFilter && memories && memories.length >= 3 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                 <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <LayoutGrid size={16} />
                    <span>Highlights Collage</span>
                 </div>
                 <MemoryCollage memories={memories.slice(0, 5)} />
              </motion.section>
           )}

           <section className="space-y-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-lg font-black">
                   {query ? `Results for "${query}"` : activeFilter ? 'Filtered' : 'All Memories'}
                 </h2>
                 <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                   {memories?.length || 0}
                 </span>
              </div>

              {(!memories || memories.length === 0) ? (
                <div className="text-center py-12">
                  <Clock size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No memories found</p>
                  <p className="text-xs text-muted-foreground">Try a different search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {memories?.map((memory, i) => (
                     <motion.div
                       key={memory.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.03 }}
                     >
                        <TimelineCard memory={memory} />
                     </motion.div>
                  ))}
                </div>
              )}
           </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
