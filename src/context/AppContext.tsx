'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type StickerStatus } from '@/components/album/StickerGrid';

export type UserProfile = {
  id: string;
  username: string;
  display_name: string;
  city: string;
  country: string;
  share_token: string;
};

type AppContextType = {
  userId: string | null;
  profile: UserProfile | null;
  statusMap: Record<string, { status: StickerStatus; quantity: number }>;
  loading: boolean;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setStatusMap: React.Dispatch<React.SetStateAction<Record<string, { status: StickerStatus; quantity: number }>>>;
  refreshData: () => Promise<void>;
  refreshProfileOnly: () => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, { status: StickerStatus; quantity: number }>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setProfile(null);
      setStatusMap({});
      setLoading(false);
      return;
    }

    setUserId(user.id);

    // Fetch profile and user stickers in parallel
    const [profileRes, stickersRes] = await Promise.all([
      supabase.from('users').select('id, username, display_name, city, country, share_token').eq('id', user.id).maybeSingle(),
      supabase.from('user_stickers').select('status, quantity, stickers(code)').eq('user_id', user.id),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data as UserProfile);
    }

    if (stickersRes.data) {
      const map: Record<string, { status: StickerStatus; quantity: number }> = {};
      stickersRes.data.forEach((row: any) => {
        const code = Array.isArray(row.stickers)
          ? row.stickers[0]?.code
          : row.stickers?.code;
        if (code) {
          map[code] = { status: row.status as StickerStatus, quantity: row.quantity || 1 };
        }
      });
      setStatusMap(map);
    }

    setLoading(false);
  };

  const refreshProfileOnly = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('id, username, display_name, city, country, share_token')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setProfile(data as UserProfile);
    }
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserId(null);
    setProfile(null);
    setStatusMap({});
  };

  useEffect(() => {
    loadData();
    // Listen for auth changes to re-fetch/clear cache
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        loadData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        userId,
        profile,
        statusMap,
        loading,
        setProfile,
        setStatusMap,
        refreshData: loadData,
        refreshProfileOnly,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
