"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { Settings as SettingsIcon, Shield, Moon, Bell, Database, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const memoriesCount = useLiveQuery(() => db.memories.count());

  const clearAllData = async () => {
    if (confirm("Are you sure? This will delete ALL your memories permanently.")) {
      await db.memories.clear();
      alert("All data cleared.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Profile" showSearch={false} />

      <div className="max-w-md mx-auto px-4 py-8 space-y-8 mb-20">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
            U
          </div>
          <h2 className="text-2xl font-bold">User</h2>
          <p className="text-muted-foreground">{memoriesCount || 0} Memories Captured</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Settings</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-muted-foreground" />
                <span>Appearance</span>
              </div>
              <span className="text-xs text-muted-foreground">System</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-muted-foreground" />
                <span>Privacy Lock</span>
              </div>
              <span className="text-xs text-muted-foreground">Off</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-muted-foreground" />
                <span>Notifications</span>
              </div>
              <span className="text-xs text-muted-foreground">Off</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">Data Management</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
              <div className="flex items-center gap-3">
                <Database size={20} className="text-muted-foreground" />
                <span>Export Data</span>
              </div>
            </button>
            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} />
                <span>Clear All Memories</span>
              </div>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          Memory Timeline v1.0.0<br/>
          Your data is stored locally on this device.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
