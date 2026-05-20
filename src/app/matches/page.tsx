'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

type Match = {
  id: string;
  otherName: string;
  otherInitials: string;
  otherCity: string;
  canGive: number;
  canReceive: number;
  score: number;
  status: string;
  colorIndex: number;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setLoggedIn(true);

      const { data } = await supabase
        .from('swap_matches')
        .select(`
          id, match_score, can_give, can_receive, status,
          user_a:users!swap_matches_user_a_id_fkey(id, display_name, username, city),
          user_b:users!swap_matches_user_b_id_fkey(id, display_name, username, city)
        `)
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (data) {
        const parsed: Match[] = data.map((m: any, idx: number) => {
          const isA   = (Array.isArray(m.user_a) ? m.user_a[0]?.id : m.user_a?.id) === user.id;
          const other = isA
            ? (Array.isArray(m.user_b) ? m.user_b[0] : m.user_b)
            : (Array.isArray(m.user_a) ? m.user_a[0] : m.user_a);
          const name  = other?.display_name || other?.username || 'Usuario';
          return {
            id:           m.id,
            otherName:    name,
            otherInitials: name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
            otherCity:    other?.city || '',
            canGive:      isA ? m.can_give : m.can_receive,
            canReceive:   isA ? m.can_receive : m.can_give,
            score:        m.match_score,
            status:       m.status,
            colorIndex:   idx % 6,
          };
        });
        setMatches(parsed);
      }
      setLoading(false);
    });
  }, []);

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Pendiente',  color: '#FAC71E' },
    accepted:  { label: 'Aceptado',   color: '#4ade80' },
    completed: { label: 'Completado', color: '#4ade80' },
    rejected:  { label: 'Rechazado',  color: '#fb7185' },
  };

  return (
    <div className="min-h-screen nav-pad pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: '#FAC71E' }}>
          MIS INTERCAMBIOS
        </span>
        <span className="font-display text-[28px] leading-none" style={{ color: '#f0eee8' }}>
          MATCHES ACTIVOS
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-dot w-2 h-2 rounded-full" style={{ background: '#FAC71E' }} />
        </div>
      )}

      {/* Not logged in */}
      {!loading && !loggedIn && (
        <div className="flex flex-col items-center gap-4 px-4 pt-20 text-center">
          <span style={{ fontSize: 40 }}>🔐</span>
          <p className="font-display text-[24px]" style={{ color: 'rgba(240,238,232,0.3)' }}>INICIA SESIÓN</p>
          <p className="text-sm" style={{ color: 'rgba(240,238,232,0.3)' }}>Para ver tus matches de intercambio</p>
          <Link
            href="/login"
            className="px-6 py-3 font-body font-medium text-sm"
            style={{ background: '#FAC71E', color: '#0a0a0f', borderRadius: 12 }}
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {/* Empty state */}
      {!loading && loggedIn && matches.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-4 pt-20 text-center">
          <span style={{ fontSize: 40 }}>🎴</span>
          <p className="font-display text-[24px]" style={{ color: 'rgba(240,238,232,0.2)' }}>SIN MATCHES AÚN</p>
          <p className="text-sm max-w-xs" style={{ color: 'rgba(240,238,232,0.28)' }}>
            Ve a Descubrir y desliza a la derecha para crear intercambios
          </p>
          <Link
            href="/discover"
            className="mt-2 px-6 py-3 font-body font-medium text-sm"
            style={{ background: 'rgba(250,199,30,0.12)', border: '0.5px solid rgba(250,199,30,0.3)', color: '#FAC71E', borderRadius: 12 }}
          >
            Ir a Descubrir →
          </Link>
        </div>
      )}

      {/* Match list */}
      {!loading && matches.length > 0 && (
        <div className="px-4 flex flex-col gap-2">
          {matches.map((m) => {
            const st = statusLabel[m.status] ?? statusLabel.pending;
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 transition-state"
                style={{
                  background: '#111119',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '14px 16px',
                }}
              >
                <Avatar initials={m.otherInitials} size={44} colorIndex={m.colorIndex} />

                <div className="flex-1 min-w-0">
                  <p className="font-display text-[18px] leading-none" style={{ color: '#f0eee8' }}>
                    {m.otherName.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {m.otherCity && (
                      <span className="text-[11px]" style={{ color: 'rgba(240,238,232,0.3)' }}>
                        📍 {m.otherCity}
                      </span>
                    )}
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.5"
                      style={{
                        background: `${st.color}15`,
                        border: `0.5px solid ${st.color}40`,
                        color: st.color,
                        borderRadius: 6,
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 flex gap-3 text-center">
                  <div>
                    <p className="font-display text-[16px] leading-none" style={{ color: '#4ade80' }}>{m.canReceive}</p>
                    <p className="text-[9px] uppercase mt-0.5" style={{ color: 'rgba(240,238,232,0.25)' }}>DAS</p>
                  </div>
                  <div>
                    <p className="font-display text-[16px] leading-none" style={{ color: '#FAC71E' }}>{m.canGive}</p>
                    <p className="text-[9px] uppercase mt-0.5" style={{ color: 'rgba(240,238,232,0.25)' }}>RECIBES</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
