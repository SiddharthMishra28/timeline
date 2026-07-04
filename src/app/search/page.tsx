"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { TimelineCard } from "@/components/TimelineCard";
import { BottomNav } from "@/components/BottomNav";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const memories = useLiveQuery(async () => {
    if (!query && !activeFilter) return [];

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
        (m.mood === activeFilter);

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  const filters = [
    { id: 'favorite', label: 'Favorites' },
    { id: 'pinned', label: 'Pinned' },
    { id: 'happy', label: 'Happy' },
    { id: 'excited', label: 'Excited' },
    { id: 'peaceful', label: 'Peaceful' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background border-b border-border p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search memories, tags, places..."
              className="w-full bg-muted border-none rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <SlidersHorizontal size={18} className="text-muted-foreground shrink-0" />
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 mb-20">
        {!query && !activeFilter ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>Try searching for "Summer" or "Travel"</p>
          </div>
        ) : memories?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No memories match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memories?.map(memory => (
              <TimelineCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
