"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function CaptureFAB() {
  return (
    <Link
      href="/create"
      className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
      aria-label="Capture memory"
    >
      <Plus size={32} />
    </Link>
  );
}
