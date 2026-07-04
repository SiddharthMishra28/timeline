"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { Search as SearchIcon, X, SlidersHorizontal, LayoutGrid } from "lucide-react";
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
    { id: 'achievement', label: 'Achievements 🏆' },
    { id: 'favorite', label: 'Favorites ❤️' },
    { id: 'pinned', label: 'Pinned 📌' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Explore" showSearch={false} />

      <div className="p-4 space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search moments, tags, places..."
            className="w-full bg-muted border-none rounded-2xl py-4 pl-10 pr-10 focus:ring-2 focus:ring-primary shadow-inner"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
             <button
               key={f.id}
               onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                 activeFilter === f.id ? 'bg-primary text-white scale-105' : 'bg-muted text-muted-foreground'
               }`}
             >
               {f.label}
             </button>
          ))}
        </div>

        <div className="space-y-8 mb-20">
           {/* Summary Collage Section */}
           {!query && !activeFilter && memories && memories.length >= 3 && (
              <section className="space-y-3">
                 <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                    <LayoutGrid size={16} />
                    <span>Highlights Collage</span>
                 </div>
                 <MemoryCollage memories={memories.slice(0, 5)} />
              </section>
           )}

           <section className="space-y-4">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black">Results</h2>
                 <span className="text-xs font-bold text-muted-foreground">{memories?.length || 0} items</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {memories?.map(memory => (
                   <motion.div layout key={memory.id}>
                      <TimelineCard memory={memory} />
                   </motion.div>
                ))}
              </div>
           </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
