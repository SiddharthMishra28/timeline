"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  level: number;
  total_points: number;
  current_streak: number;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; display_name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple local auth for client-side only mode
function getLocalUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('lifestream_user');
  if (stored) {
    try { return JSON.parse(stored); } catch { return null; }
  }
  return null;
}

function saveLocalUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lifestream_user', JSON.stringify(user));
  }
}

function clearLocalUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lifestream_user');
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const localUser = getLocalUser();
      if (localUser) {
        setUser(localUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    // Local auth - create/retrieve user
    const userData: User = {
      id: email.split('@')[0],
      email,
      username: email.split('@')[0],
      display_name: email.split('@')[0],
      level: 1,
      total_points: 0,
      current_streak: 0,
    };
    saveLocalUser(userData);
    setUser(userData);
  };

  const register = async (data: { email: string; username: string; password: string; display_name?: string }) => {
    const userData: User = {
      id: data.username,
      email: data.email,
      username: data.username,
      display_name: data.display_name || data.username,
      level: 1,
      total_points: 0,
      current_streak: 0,
    };
    saveLocalUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    clearLocalUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
