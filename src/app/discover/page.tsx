'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import CardStack, { type CardStackHandle } from '@/components/discover/CardStack';
import ActionButtons from '@/components/discover/ActionButtons';
import { type MatchProfile } from '@/components/discover/MatchCard';
import { DiscoverSkeleton } from '@/components/ui/Skeletons';

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
  const [matchPopup, setMatchPopup] = useState<MatchProfile | null>(null);

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

    // Check if there is an existing match record between these two users in either direction
    const { data: existingMatch } = await supabase
      .from('swap_matches')
      .select('*')
      .or(`and(user_a_id.eq.${userId},user_b_id.eq.${profile.userId}),and(user_a_id.eq.${profile.userId},user_b_id.eq.${userId})`)
      .maybeSingle();

    if (existingMatch) {
      // If the other user already liked this user (it is pending and user_a_id is the other user)
      if (existingMatch.status === 'pending' && existingMatch.user_a_id === profile.userId) {
        // Mutual Match! Update status to accepted
        await supabase
          .from('swap_matches')
          .update({
            status: 'accepted',
            match_score: profile.score,
            can_give: profile.canGive,
            can_receive: profile.canReceive,
          })
          .eq('id', existingMatch.id);

        setMatchPopup(profile);
        setMatchCount(prev => prev + 1);
      }
    } else {
      // First user to swipe right: insert pending row
      await supabase.from('swap_matches').insert({
        user_a_id:    userId,
        user_b_id:    profile.userId,
        match_score:  profile.score,
        can_give:     profile.canGive,
        can_receive:  profile.canReceive,
        status:       'pending',
      });
    }
  }, [userId]);

  const handleReject = useCallback((_profile: MatchProfile) => {
    // Could log rejected users to not show them again
  }, []);

  const cardStackRef = useRef<CardStackHandle>(null);

  return (
    <div className="relative min-h-screen pb-4 nav-pad">
      {/* ── Header ──────────────────────────────── */}
      {loadState !== 'loading' && (
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <div className="flex flex-col gap-1.5">
          <span className="block text-[10px] font-bold uppercase tracking-[0.25em] font-body" style={{ color: '#FFCB2F' }}>
            INTERCAMBIO
          </span>
          <span className="font-display text-[32px] font-bold leading-none tracking-tight" style={{ color: '#f0eee8' }}>
            ENCONTRAR MATCH
          </span>
        </div>

        <div
          className="flex flex-col items-center px-3 py-2 animate-glow-pulse"
          style={{
            background: 'rgba(255,203,47,0.09)',
            border: '1px solid rgba(255,203,47,0.25)',
            borderRadius: 16,
            minWidth: 62,
          }}
        >
          <span className="font-display text-[28px] leading-none" style={{ color: '#FFCB2F' }}>
            {matchCount}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-body" style={{ color: 'rgba(255,203,47,0.55)' }}>
            matches
          </span>
        </div>
      </div>
      )}

      {/* ── Status banner ───────────────────────── */}
      {loadState !== 'loading' && loadState === 'no-auth' && (
        <div
          className="mx-5 mb-4 flex items-center gap-2 px-4 py-2.5 text-[12px] font-body"
          style={{
            background: 'rgba(255,203,47,0.07)',
            border: '1px solid rgba(255,203,47,0.20)',
            borderRadius: 12,
            color: 'rgba(255,203,47,0.85)',
          }}
        >
          <span>⚡</span>
          <span>Modo demo &mdash; <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>inicia sesión</a> para ver matches reales</span>
        </div>
      )}

      {loadState === 'loading' && <DiscoverSkeleton />}

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
      {/* ── Mutual Match Popup ──────────────────── */}
      {matchPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{
            background: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="w-full max-w-sm bg-[#0e0e16] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 text-center shadow-2xl animate-scale-up"
            style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex justify-center mb-4">
              <span className="text-5xl animate-bounce-slow">🎉</span>
            </div>
            
            <span
              className="inline-block text-[10px] font-bold tracking-widest px-3 py-1 mb-3"
              style={{
                background: 'rgba(74, 222, 128, 0.15)',
                border: '0.5px solid rgba(74, 222, 128, 0.3)',
                color: '#4ade80',
                borderRadius: '99px',
              }}
            >
              ¡NUEVO MATCH!
            </span>

            <h3 className="font-display text-[26px] leading-tight text-[#f0eee8] mb-2">
              ¡Hiciste Match con {matchPopup.name}!
            </h3>

            <p className="text-[13px] text-[rgba(240,238,232,0.45)] mb-6 px-2 leading-relaxed">
              Ambos tienen cromos repetidos que el otro necesita para completar su álbum. ¡Empiecen a hablar para coordinar el intercambio!
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/matches"
                className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center"
                style={{
                  background: '#FAC71E',
                  color: '#0a0a0f',
                }}
              >
                Ver mis matches 💬
              </Link>
              
              <button
                onClick={() => setMatchPopup(null)}
                className="w-full py-3 rounded-xl font-body text-xs text-[rgba(240,238,232,0.45)] hover:text-[rgba(240,238,232,0.8)] transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}
              >
                Seguir buscando
              </button>
            </div>

            {/* Signature */}
            <div className="mt-6 opacity-20 flex justify-center">
              <span className="text-[9px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
