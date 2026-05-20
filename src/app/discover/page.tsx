'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import CardStack, { type CardStackHandle } from '@/components/discover/CardStack';
import ActionButtons from '@/components/discover/ActionButtons';
import { type MatchProfile } from '@/components/discover/MatchCard';

const ALBUM_ID = 'a0000000-0000-0000-0000-000000000001';

// Mock profiles for when user isn't logged in
const DEMO_PROFILES: MatchProfile[] = [
  {
    userId: 'demo-1', name: 'Carlos M.', initials: 'CM', city: 'Lima',
    completion: 62, score: 9, perfect: true, colorIndex: 0,
    getCodes: ['ARG17', 'BRA9', 'FRA20', 'MEX3'],
    giveCodes: ['ESP15', 'GER11', 'COL14'],
    canGive: 4, canReceive: 3,
  },
  {
    userId: 'demo-2', name: 'Sofía R.', initials: 'SR', city: 'Bogotá',
    completion: 48, score: 6, perfect: false, colorIndex: 1,
    getCodes: ['POR10', 'NED11', 'BRA7'],
    giveCodes: ['ARG3', 'FRA15', 'MEX12'],
    canGive: 3, canReceive: 3,
  },
  {
    userId: 'demo-3', name: 'Diego V.', initials: 'DV', city: 'CDMX',
    completion: 71, score: 11, perfect: false, colorIndex: 2,
    getCodes: ['ESP7', 'ARG4', 'GER9', 'FRA8', 'BRA14'],
    giveCodes: ['MEX1', 'COL5', 'POR3'],
    canGive: 5, canReceive: 3,
  },
];

type LoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'no-auth';

export default function DiscoverPage() {
  const [profiles, setProfiles]     = useState<MatchProfile[]>([]);
  const [loadState, setLoadState]   = useState<LoadState>('idle');
  const [matchCount, setMatchCount] = useState(0);
  const [userId, setUserId]         = useState<string | null>(null);

  /* ── Load matches from Supabase ── */
  useEffect(() => {
    const supabase = createClient();
    setLoadState('loading');

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setProfiles(DEMO_PROFILES);
        setLoadState('no-auth');
        return;
      }

      setUserId(user.id);

      try {
        // 1. Call find_matches RPC
        const { data: matches, error } = await supabase
          .rpc('find_matches', {
            current_user_id: user.id,
            album_id_filter: ALBUM_ID,
          });

        if (error) throw error;

        if (!matches || matches.length === 0) {
          setProfiles([]);
          setLoadState('loaded');
          return;
        }

        // 2. For each match, get sample sticker codes
        const enriched: MatchProfile[] = await Promise.all(
          matches.map(async (m: any, idx: number) => {
            // Get codes they can give (their repeated, my wanted)
            const { data: giveCodes } = await supabase
              .from('user_stickers')
              .select('stickers(code)')
              .eq('user_id', m.user_id)
              .eq('status', 'repeated')
              .limit(6);

            // Get codes I can give them (my repeated, their wanted)
            const { data: myCodes } = await supabase
              .from('user_stickers')
              .select('stickers(code)')
              .eq('user_id', user.id)
              .eq('status', 'repeated')
              .limit(6);

            const extractCodes = (rows: any[]) =>
              (rows ?? []).map((r: any) =>
                Array.isArray(r.stickers) ? r.stickers[0]?.code : r.stickers?.code
              ).filter(Boolean);

            // Get completion % for this user
            const { count: ownedCount } = await supabase
              .from('user_stickers')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', m.user_id)
              .eq('status', 'owned');

            const name = m.display_name || m.username || 'Usuario';
            const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

            return {
              userId: m.user_id,
              name,
              initials,
              city: m.city || '',
              completion: Math.round(((ownedCount ?? 0) / 980) * 100),
              canGive: m.can_give,
              canReceive: m.can_receive,
              score: m.match_score,
              perfect: m.can_give > 0 && m.can_receive > 0,
              giveCodes: extractCodes(myCodes ?? []),
              getCodes: extractCodes(giveCodes ?? []),
              colorIndex: idx % 6,
            } satisfies MatchProfile;
          })
        );

        setProfiles(enriched);
        setMatchCount(enriched.length);
        setLoadState('loaded');
      } catch (err) {
        console.error('Error loading matches:', err);
        setProfiles(DEMO_PROFILES);
        setLoadState('error');
      }
    });
  }, []);

  /* ── Accept: create swap_match in Supabase ── */
  const handleAccept = useCallback(async (profile: MatchProfile) => {
    if (!userId) return;
    const supabase = createClient();

    await supabase.from('swap_matches').upsert({
      user_a_id:    userId,
      user_b_id:    profile.userId,
      match_score:  profile.score,
      can_give:     profile.canGive,
      can_receive:  profile.canReceive,
      status:       'pending',
    }, { onConflict: 'user_a_id,user_b_id', ignoreDuplicates: true });

    setMatchCount(prev => prev + 1);
  }, [userId]);

  const handleReject = useCallback((_profile: MatchProfile) => {
    // Could log rejected users to not show them again
  }, []);

  const cardStackRef = useRef<CardStackHandle>(null);

  return (
    <div className="relative min-h-screen pb-4 nav-pad">
      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <div>
          <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: '#FAC71E' }}>
            INTERCAMBIO
          </span>
          <span className="font-display text-[28px] leading-none" style={{ color: '#f0eee8' }}>
            ENCONTRAR MATCH
          </span>
        </div>

        <div
          className="flex flex-col items-center px-3 py-2"
          style={{
            background: 'rgba(250,199,30,0.08)',
            border: '0.5px solid rgba(250,199,30,0.2)',
            borderRadius: 12,
          }}
        >
          <span className="font-display text-[26px] leading-none" style={{ color: '#FAC71E' }}>
            {matchCount}
          </span>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(250,199,30,0.5)' }}>
            matches
          </span>
        </div>
      </div>

      {/* ── Status banner ───────────────────────── */}
      {loadState === 'no-auth' && (
        <div
          className="mx-4 mb-3 flex items-center gap-2 px-3 py-2 text-[11px]"
          style={{
            background: 'rgba(250,199,30,0.07)',
            border: '0.5px solid rgba(250,199,30,0.2)',
            borderRadius: 10,
            color: 'rgba(250,199,30,0.8)',
          }}
        >
          <span>⚡</span>
          <span>Modo demo — <a href="/login" style={{ textDecoration: 'underline' }}>inicia sesión</a> para ver matches reales</span>
        </div>
      )}

      {loadState === 'loading' && (
        <div className="flex justify-center py-8">
          <div
            className="animate-pulse-dot w-2 h-2 rounded-full"
            style={{ background: '#FAC71E' }}
          />
        </div>
      )}

      {/* ── Card Stack ──────────────────────────── */}
      {(loadState === 'loaded' || loadState === 'no-auth' || loadState === 'error') && (
        <>
          <CardStack
            ref={cardStackRef}
            profiles={profiles}
            onAccept={handleAccept}
            onReject={handleReject}
          />

          {/* ── Action Buttons ─────────────────── */}
          <ActionButtons
            onReject={() => cardStackRef.current?.swipeLeft()}
            onAccept={() => cardStackRef.current?.swipeRight()}
            onSuper={() => cardStackRef.current?.swipeRight()}
            disabled={profiles.length === 0}
          />

          {/* ── Swipe hint ──────────────────────── */}
          <p className="text-center text-[10px] mt-2" style={{ color: 'rgba(240,238,232,0.18)' }}>
            Desliza la carta o usa los botones
          </p>
        </>
      )}
    </div>
  );
}
