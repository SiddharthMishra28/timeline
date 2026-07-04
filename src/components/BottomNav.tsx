"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Search, User, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Feed", icon: Clock, href: "/" },
    { label: "Explore", icon: Search, href: "/search" },
    { label: "Me", icon: User, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50">
      <div className="max-w-md mx-auto glass rounded-full shadow-2xl p-2 flex justify-around items-center border border-white/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative group"
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-full transition-all duration-500",
                  isActive
                    ? "bg-primary text-white shadow-lg scale-110"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </div>
              <span className={cn(
                "absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md",
                isActive && "opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
