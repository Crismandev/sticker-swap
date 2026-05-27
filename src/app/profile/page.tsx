'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Avatar from '@/components/ui/Avatar';
import CodeChip from '@/components/ui/CodeChip';
import ProgressBar from '@/components/album/ProgressBar';
import StatsRow from '@/components/album/StatsRow';
import Link from 'next/link';
import { ProfileSkeleton, FullScreenLoader } from '@/components/ui/Skeletons';

type TeamGroup = {
  team: string;
  flag: string;
  codes: string[];
};

function SectionGroup({
  team, flag, codes, variant,
}: {
  team: string; flag: string; codes: string[]; variant: 'give' | 'get';
}) {
  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 mb-2 px-3 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
        }}
      >
        <span>{flag}</span>
        <span className="flex-1 text-[12px] font-body font-medium" style={{ color: '#f0eee8' }}>{team}</span>
        <span className="text-[11px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>{codes.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 px-1">
        {codes.map(c => {
          return <CodeChip key={c} code={c} variant={variant} />;
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('PE');
  const [shareToken, setShareToken] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('PE');
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    owned: 0,
    repeated: 0,
    missing: 980,
    total: 980,
  });

  // Dynamic sticker lists
  const [repeatedList, setRepeatedList] = useState<TeamGroup[]>([]);
  const [missingList, setMissingList] = useState<TeamGroup[]>([]);

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndStats = async (uid: string) => {
    const supabase = createClient();

    // 1. Fetch profile info
    const { data: profile } = await supabase
      .from('users')
      .select('username, display_name, city, country, share_token')
      .eq('id', uid)
      .single();

    if (profile) {
      setUsername(profile.username || '');
      setDisplayName(profile.display_name || '');
      setCity(profile.city || '');
      setCountry(profile.country || 'PE');
      setShareToken(profile.share_token || '');

      setEditName(profile.display_name || '');
      setEditCity(profile.city || '');
      setEditCountry(profile.country || 'PE');
    }

    // 2. Fetch owned statistics count
    const { count: ownedCount } = await supabase
      .from('user_stickers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .in('status', ['owned', 'repeated']);

    // 3. Fetch repeated statistics count (sum of quantities)
    const { data: repeatedRows } = await supabase
      .from('user_stickers')
      .select('quantity')
      .eq('user_id', uid)
      .eq('status', 'repeated');

    const repCount = (repeatedRows || []).reduce((acc, row) => acc + (row.quantity || 1), 0);
    const ownCount = ownedCount || 0;

    setStats({
      owned: ownCount,
      repeated: repCount,
      missing: Math.max(0, 980 - ownCount),
      total: 980,
    });

    // 4. Fetch repeated stickers grouping by section
    const { data: repeatedStickers } = await supabase
      .from('user_stickers')
      .select('quantity, stickers(code, name, sections(name, flag_emoji))')
      .eq('user_id', uid)
      .eq('status', 'repeated');

    // 5. Fetch missing (wanted) stickers grouping by section
    const { data: wantedStickers } = await supabase
      .from('user_stickers')
      .select('stickers(code, name, sections(name, flag_emoji))')
      .eq('user_id', uid)
      .eq('status', 'wanted');

    // Helper to group by team
    const groupByTeam = (data: any[]): TeamGroup[] => {
      const groups: Record<string, { flag: string; codes: string[] }> = {};
      data?.forEach(row => {
        const sticker = Array.isArray(row.stickers) ? row.stickers[0] : row.stickers;
        if (!sticker) return;
        const section = sticker.sections || sticker.sections?.[0];
        const teamName = section?.name || 'Especial';
        const flag = section?.flag_emoji || '🏆';

        if (!groups[teamName]) {
          groups[teamName] = { flag, codes: [] };
        }
        const q = row.quantity && row.quantity > 1 ? ` (x${row.quantity})` : '';
        groups[teamName].codes.push(`${sticker.code}${q}`);
      });

      return Object.entries(groups).map(([team, val]) => ({
        team,
        flag: val.flag,
        codes: val.codes.sort(),
      }));
    };

    setRepeatedList(groupByTeam(repeatedStickers || []));
    setMissingList(groupByTeam(wantedStickers || []));
    setLoading(false);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);
      fetchProfileAndStats(user.id);
    });
  }, []);

  const handleSaveProfile = async () => {
    if (!userId || !editName.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .update({
        display_name: editName.trim(),
        city: editCity.trim(),
        country: editCountry.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    setSaving(false);
    if (error) {
      setToast('Error al guardar el perfil');
      setTimeout(() => setToast(null), 2000);
    } else {
      setDisplayName(editName.trim());
      setCity(editCity.trim());
      setCountry(editCountry.trim());
      setIsEditing(false);
      setToast('¡Perfil actualizado con éxito!');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setToast('Geolocalización no soportada');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: {
                'Accept-Language': 'es',
              },
            }
          );
          if (!res.ok) throw new Error('Query failed');
          const data = await res.json();
          if (data && data.address) {
            const detectedCity = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
            const detectedCountry = data.address.country_code ? data.address.country_code.toUpperCase() : 'PE';
            if (detectedCity) setEditCity(detectedCity);
            setEditCountry(detectedCountry);
            setToast('📍 ¡Ubicación detectada!');
            setTimeout(() => setToast(null), 2000);
          } else {
            setToast('No se reconoció la zona');
            setTimeout(() => setToast(null), 2000);
          }
        } catch (err) {
          console.error(err);
          setToast('Error al buscar ciudad');
          setTimeout(() => setToast(null), 2000);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        setToast('Permiso de ubicación denegado');
        setTimeout(() => setToast(null), 2000);
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleCopyLink = () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/profile/${shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setToast('¡Enlace de perfil copiado!');
      setTimeout(() => setToast(null), 2000);
    }).catch(() => {
      setToast('Error al copiar el enlace');
      setTimeout(() => setToast(null), 2000);
    });
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!userId) {
    return <FullScreenLoader />;
  }

  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative min-h-screen pb-20 bg-[#08080e] text-[#f0eee8] nav-pad">
      {/* Profile Header */}
      <div
        className="px-5 pb-6 pt-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #161628 0%, #08080e 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Stadium glow + decorative ring */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(255,203,47,0.07) 0%, transparent 70%)' }} />

        <div className="flex flex-col items-center mb-5 relative z-10">
          {/* Avatar with gold pulsing ring */}
          <div className="relative mb-1">
            <div
              className="absolute inset-0 rounded-full animate-glow-pulse"
              style={{ margin: -4, borderRadius: '50%', border: '2px solid rgba(255,203,47,0.45)' }}
            />
            <Avatar initials={initials} size={88} colorIndex={4} />
          </div>
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <h1 className="font-display text-[30px] leading-none" style={{ color: '#f0eee8' }}>
                {displayName.toUpperCase()}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 opacity-55 hover:opacity-100 transition-all flex items-center justify-center rounded-lg active:scale-90"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            </div>
            <p className="text-[13px] font-body flex items-center justify-center gap-1.5" style={{ color: 'rgba(240,238,232,0.40)' }}>
              <span style={{ color: 'rgba(255,203,47,0.7)' }}>@{username || 'usuario'}</span>
              {city && (
                <>
                  <span style={{ color: 'rgba(240,238,232,0.2)' }}>·</span>
                  <span>📍 {city}, {country}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <ProgressBar owned={stats.owned} total={stats.total} />

        <StatsRow
          owned={stats.owned}
          repeated={stats.repeated}
          missing={stats.missing}
        />

        {/* Action buttons */}
        <div className="flex flex-col relative z-10" style={{ marginTop: '20px', gap: '10px' }}>
          <Link
            href="/discover"
            id="profile-swap-btn"
            className="w-full py-3.5 text-[15px] font-body font-bold flex items-center justify-center gap-2 rounded-[14px] transition-all active:scale-[0.97]"
            style={{
              background: '#FFCB2F',
              color: '#08080e',
              boxShadow: '0 4px 20px rgba(255,203,47,0.30)',
            }}
          >
            <span>Intercambiar</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </Link>
          <div className="flex" style={{ gap: '10px' }}>
            <button
              onClick={handleCopyLink}
              id="profile-share-btn"
              className="flex-1 py-3 text-[13px] font-body font-medium flex items-center justify-center gap-1.5 card-hover-transition rounded-[14px]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(240,238,232,0.65)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 12v2a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2M10 4V2a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2h2" />
              </svg>
              Copiar enlace
            </button>
            <Link
              href="/album/quick"
              className="flex-1 py-3 text-[13px] font-body font-semibold flex items-center justify-center gap-2 rounded-[14px] transition-all active:scale-[0.97]"
              style={{
                background: 'rgba(255,203,47,0.08)',
                border: '1px solid rgba(255,203,47,0.22)',
                color: '#FFCB2F',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              Carga rápida
            </Link>
          </div>
        </div>
      </div>

      {/* Repeated section */}
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-[18px] tracking-wide text-[#f0eee8]">
            DISPONIBLES PARA INTERCAMBIO
          </h2>
          <span
            className="text-[11px] font-body font-medium px-2 py-0.5"
            style={{
              background: 'rgba(250,199,30,0.1)',
              border: '0.5px solid rgba(250,199,30,0.25)',
              color: '#FAC71E',
              borderRadius: '10px',
            }}
          >
            {repeatedList.reduce((s, g) => s + g.codes.length, 0)}
          </span>
        </div>

        {repeatedList.length > 0 ? (
          repeatedList.map(g => (
            <SectionGroup key={g.team} {...g} variant="give" />
          ))
        ) : (
          <div
            className="px-4 py-8 text-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-center mx-auto w-12 h-12 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,232,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="13" y2="13"></line>
              </svg>
            </div>
            <p className="text-xs text-[rgba(240,238,232,0.35)]">No tienes cromos repetidos marcados aún.</p>
            <Link href="/album" className="mt-2 inline-block text-xs font-semibold text-[#FAC71E] underline">
              Ir a mi Álbum
            </Link>
          </div>
        )}
      </div>

      {/* Missing section */}
      <div className="px-4 pt-6 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-[18px] tracking-wide text-[#f0eee8]">
            ME FALTAN (EN MI LISTA DE DESEOS)
          </h2>
          <span
            className="text-[11px] font-body font-medium px-2 py-0.5"
            style={{
              background: 'rgba(251,113,133,0.1)',
              border: '0.5px solid rgba(251,113,133,0.25)',
              color: '#fb7185',
              borderRadius: '10px',
            }}
          >
            {missingList.reduce((s, g) => s + g.codes.length, 0)}
          </span>
        </div>

        {missingList.length > 0 ? (
          missingList.map(g => (
            <SectionGroup key={g.team} {...g} variant="get" />
          ))
        ) : (
          <div
            className="px-4 py-8 text-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <div className="flex items-center justify-center mx-auto w-12 h-12 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,232,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <p className="text-xs text-[rgba(240,238,232,0.35)]">No has agregado cromos a tu lista de deseos.</p>
            <Link href="/album" className="mt-2 inline-block text-xs font-semibold text-[#fb7185] underline">
              Ir a mi Álbum
            </Link>
          </div>
        )}
      </div>

      {/* Profile Edit Bottom Sheet Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-[6px] animate-fade-in"
            onClick={() => setIsEditing(false)}
          />
          {/* Bottom Sheet */}
          <div className="relative w-full max-w-md bg-[#0f0f1c] border-t border-[rgba(255,255,255,0.12)] rounded-t-[32px] p-6 pb-12 sm:pb-8 animate-slide-up z-10 flex flex-col gap-5 shadow-2xl">
            {/* Grabber indicator */}
            <div className="w-12 h-1.5 bg-[rgba(255,255,255,0.15)] rounded-full mx-auto" />
            
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[22px] tracking-wide text-[#f0eee8] uppercase">
                Editar Perfil
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[rgba(240,238,232,0.6)] active:scale-90 transition-all"
                style={{ cursor: 'pointer' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[rgba(240,238,232,0.4)] block mb-1.5 font-bold font-body">
                  Nombre de pantalla
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full max-w-sm px-4 py-3 bg-[#161625] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-body focus:outline-none focus:border-[#FFCB2F] text-[#f0eee8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[rgba(240,238,232,0.4)] block font-bold font-body">
                      Ciudad
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="text-[9px] font-bold text-[#FFCB2F] hover:underline disabled:opacity-40 flex items-center gap-1"
                      style={{ cursor: 'pointer' }}
                    >
                      {detectingLocation ? (
                        <>
                          <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" strokeDasharray="30 10" strokeDashoffset="0"></circle>
                          </svg>
                          <span>Buscando...</span>
                        </>
                      ) : (
                        <>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>Auto</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#161625] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-body focus:outline-none focus:border-[#FFCB2F] text-[#f0eee8]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[rgba(240,238,232,0.4)] block mb-1.5 font-bold font-body">
                    País (ISO)
                  </label>
                  <input
                    type="text"
                    value={editCountry}
                    maxLength={2}
                    onChange={(e) => setEditCountry(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-[#161625] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm font-body text-center focus:outline-none focus:border-[#FFCB2F] text-[#f0eee8]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] active:scale-95 transition-all text-[rgba(240,238,232,0.7)]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving || !editName.trim()}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-[#FFCB2F] text-[#08080e] active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ boxShadow: '0 4px 16px rgba(255,203,47,0.2)' }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 animate-toast-in z-50 px-4 py-2.5 text-xs font-body font-medium whitespace-nowrap"
          style={{
            background: '#14141c',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '99px',
            color: '#FAC71E',
          }}
        >
          {toast}
        </div>
      )}

      {/* Signature */}
      <div className="flex justify-center items-center py-6 opacity-35">
        <span className="text-[10px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
      </div>
    </div>
  );
}
