'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Avatar from '@/components/ui/Avatar';
import CodeChip from '@/components/ui/CodeChip';
import ProgressBar from '@/components/album/ProgressBar';
import StatsRow from '@/components/album/StatsRow';
import Link from 'next/link';
import { ProfileSkeleton, FullScreenLoader } from '@/components/ui/Skeletons';
import { useApp } from '@/context/AppContext';
import { SECTIONS } from '@/lib/sections';

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
  const { userId, profile, statusMap, setStatusMap, loading, refreshData, refreshProfileOnly, logout } = useApp();

  const username = profile?.username || '';
  const displayName = profile?.display_name || 'Sticker Collector';
  const city = profile?.city || '';
  const country = profile?.country || 'PE';
  const shareToken = profile?.share_token || '';

  // Dev Console states
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    'Consola Sticker Swap Dev v1.0',
    'Escribe /help para ver comandos disponibles.'
  ]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editCountry, setEditCountry] = useState('PE');
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync editing fields with profile when it loads
  useEffect(() => {
    if (profile) {
      setEditName(profile.display_name || '');
      setEditCity(profile.city || '');
      setEditCountry(profile.country || 'PE');
    }
  }, [profile]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !userId) {
      window.location.href = '/login';
    }
  }, [loading, userId]);

  type StickerStatus = 'owned' | 'repeated' | 'wanted';

  const [codeToIdMap, setCodeToIdMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'summary' | 'organizer'>('summary');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeConfigCode, setActiveConfigCode] = useState<string | null>(null);

  // Load valid sticker codes -> ID mapping for fast status toggle
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('stickers')
      .select('id, code')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach(s => {
            map[s.code.toUpperCase()] = s.id;
          });
          setCodeToIdMap(map);
        }
      });
  }, []);

  const handleStickerStatusChange = async (code: string, status: StickerStatus, quantity: number = 1) => {
    if (!userId) return;
    const stickerId = codeToIdMap[code.toUpperCase()];
    if (!stickerId) return;

    // 1. Optimistic update in context statusMap
    const previousMap = { ...statusMap };
    const updatedMap = { ...statusMap };
    
    if (status === 'wanted' && quantity === 0) {
      delete updatedMap[code];
    } else {
      updatedMap[code] = { status, quantity };
    }
    setStatusMap(updatedMap);

    // 2. Perform DB update in background
    const supabase = createClient();
    try {
      if (status === 'wanted' && quantity === 0) {
        await supabase
          .from('user_stickers')
          .delete()
          .eq('user_id', userId)
          .eq('sticker_id', stickerId);
      } else {
        const { data: existing } = await supabase
          .from('user_stickers')
          .select('id')
          .eq('user_id', userId)
          .eq('sticker_id', stickerId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('user_stickers')
            .update({ status, quantity, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('user_stickers')
            .insert({ user_id: userId, sticker_id: stickerId, status, quantity });
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      // Fallback
      setStatusMap(previousMap);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalStickers = 980;
    const owned = Object.values(statusMap).filter(s => s.status === 'owned' || s.status === 'repeated').length;
    const repeated = Object.values(statusMap).reduce((acc, s) => acc + (s.status === 'repeated' ? s.quantity : 0), 0);
    return {
      owned,
      repeated,
      missing: Math.max(0, totalStickers - owned),
      total: totalStickers,
    };
  }, [statusMap]);

  // Dynamic sticker lists
  const repeatedList = useMemo(() => {
    const groups: Record<string, { flag: string; codes: string[] }> = {};
    Object.entries(statusMap).forEach(([code, entry]) => {
      if (entry.status !== 'repeated') return;
      const prefix = code.slice(0, 3);
      const section = SECTIONS.find(s => s.code === prefix) || { name: 'Especial', flag: '🏆' };
      const teamName = section.name;
      const flag = section.flag;

      if (!groups[teamName]) {
        groups[teamName] = { flag, codes: [] };
      }
      const q = entry.quantity > 1 ? ` (x${entry.quantity})` : '';
      groups[teamName].codes.push(`${code}${q}`);
    });

    return Object.entries(groups).map(([team, val]) => ({
      team,
      flag: val.flag,
      codes: val.codes.sort((a, b) => {
        const numA = parseInt(a.replace(/^\D+/g, ''), 10);
        const numB = parseInt(b.replace(/^\D+/g, ''), 10);
        return numA - numB;
      }),
    }));
  }, [statusMap]);

  const missingList = useMemo(() => {
    const groups: Record<string, { flag: string; codes: string[] }> = {};
    SECTIONS.forEach(section => {
      const teamName = section.name;
      const flag = section.flag;
      const codes: string[] = [];

      for (let i = 1; i <= section.total; i++) {
        const code = `${section.code}${i}`;
        const entry = statusMap[code];
        // If it's not owned and not repeated, it's missing!
        if (!entry || (entry.status !== 'owned' && entry.status !== 'repeated')) {
          codes.push(code);
        }
      }

      if (codes.length > 0) {
        groups[teamName] = { flag, codes };
      }
    });

    return Object.entries(groups).map(([team, val]) => ({
      team,
      flag: val.flag,
      codes: val.codes.sort((a, b) => {
        const numA = parseInt(a.replace(/^\D+/g, ''), 10);
        const numB = parseInt(b.replace(/^\D+/g, ''), 10);
        return numA - numB;
      }),
    }));
  }, [statusMap]);

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
      await refreshProfileOnly();
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleConsoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = consoleInput.trim();
    if (!input) return;

    setConsoleInput('');
    setConsoleLog(prev => [...prev, `> ${input}`]);

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts[1];

    const supabase = createClient();

    if (command === '/help') {
      setConsoleLog(prev => [
        ...prev,
        'Comandos disponibles:',
        '  /help                 Muestra este menú.',
        '  /reset                Borra todas tus figuritas.',
        '  /fill [porcentaje]    Rellena el álbum con un % de cromos (ej: /fill 50).',
        '  /repeated [cantidad]  Añade N cromos repetidos al azar.',
        '  /missing [cantidad]   Añade N cromos deseados (faltantes) al azar.',
        '  /clear-log            Limpia la pantalla de consola.'
      ]);
      return;
    }

    if (command === '/clear-log') {
      setConsoleLog([]);
      return;
    }

    if (!userId) {
      setConsoleLog(prev => [...prev, 'Error: No hay usuario autenticado.']);
      return;
    }

    try {
      if (command === '/reset') {
        setConsoleLog(prev => [...prev, 'Borrando figuritas...']);
        const { error } = await supabase
          .from('user_stickers')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
        setConsoleLog(prev => [...prev, '¡Exito! Todas las figuritas eliminadas.']);
        await refreshData();
        return;
      }

      if (command === '/fill') {
        const pct = parseInt(arg || '50');
        if (isNaN(pct) || pct < 1 || pct > 100) {
          setConsoleLog(prev => [...prev, 'Error: Porcentaje inválido (1-100).']);
          return;
        }
        setConsoleLog(prev => [...prev, `Rellenando álbum al ${pct}%...`]);

        const { data: stickers, error: fetchErr } = await supabase
          .from('stickers')
          .select('id');

        if (fetchErr) throw fetchErr;
        if (!stickers || stickers.length === 0) {
          setConsoleLog(prev => [...prev, 'Error: No hay stickers en la base de datos.']);
          return;
        }

        const count = Math.floor((pct / 100) * stickers.length);
        const shuffled = [...stickers].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        // Clear previous
        await supabase.from('user_stickers').delete().eq('user_id', userId);

        const rows = selected.map(s => ({
          user_id: userId,
          sticker_id: s.id,
          status: 'owned',
          quantity: 1,
          updated_at: new Date().toISOString()
        }));

        const batchSize = 200;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          const { error: insErr } = await supabase.from('user_stickers').insert(batch);
          if (insErr) throw insErr;
        }

        setConsoleLog(prev => [...prev, `¡Exito! Álbum cargado con ${count} cromos (${pct}%).`]);
        await refreshData();
        return;
      }

      if (command === '/repeated') {
        const count = parseInt(arg || '10');
        if (isNaN(count) || count < 1 || count > 100) {
          setConsoleLog(prev => [...prev, 'Error: Cantidad inválida (1-100).']);
          return;
        }
        setConsoleLog(prev => [...prev, `Añadiendo ${count} repetidos...`]);

        const { data: stickers, error: fetchErr } = await supabase
          .from('stickers')
          .select('id');

        if (fetchErr) throw fetchErr;

        const shuffled = [...stickers].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        const rows = selected.map(s => ({
          user_id: userId,
          sticker_id: s.id,
          status: 'repeated',
          quantity: Math.floor(Math.random() * 3) + 2,
          updated_at: new Date().toISOString()
        }));

        const { error: insErr } = await supabase.from('user_stickers').upsert(rows, { onConflict: 'user_id,sticker_id' });
        if (insErr) throw insErr;

        setConsoleLog(prev => [...prev, `¡Exito! Añadidos ${count} cromos repetidos.`]);
        await refreshData();
        return;
      }

      if (command === '/missing') {
        const count = parseInt(arg || '10');
        if (isNaN(count) || count < 1 || count > 100) {
          setConsoleLog(prev => [...prev, 'Error: Cantidad inválida (1-100).']);
          return;
        }
        setConsoleLog(prev => [...prev, `Añadiendo ${count} deseados...`]);

        const { data: stickers, error: fetchErr } = await supabase
          .from('stickers')
          .select('id');

        if (fetchErr) throw fetchErr;

        const shuffled = [...stickers].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        const rows = selected.map(s => ({
          user_id: userId,
          sticker_id: s.id,
          status: 'wanted',
          quantity: 1,
          updated_at: new Date().toISOString()
        }));

        const { error: insErr } = await supabase.from('user_stickers').upsert(rows, { onConflict: 'user_id,sticker_id' });
        if (insErr) throw insErr;

        setConsoleLog(prev => [...prev, `¡Exito! Añadidos ${count} cromos faltantes.`]);
        await refreshData();
        return;
      }

      setConsoleLog(prev => [...prev, `Error: Comando desconocido "${command}". Escribe /help.`]);
    } catch (err: any) {
      setConsoleLog(prev => [...prev, `Error al ejecutar: ${err.message || err}`]);
    }
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
              <button
                onClick={() => setIsConsoleOpen(true)}
                className="p-1.5 opacity-55 hover:opacity-100 transition-all flex items-center justify-center rounded-lg active:scale-90 text-[#FFCB2F]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                title="Consola de Desarrollo"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
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
          <button
            onClick={handleLogout}
            id="profile-logout-btn"
            className="w-full py-3.5 text-[14px] font-body font-semibold flex items-center justify-center gap-2 rounded-[14px] transition-all active:scale-[0.97] hover:scale-[1.01]"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.22)',
              color: '#ef4444',
              cursor: 'pointer',
              marginTop: '5px',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="px-4 pt-6">
        <div 
          className="flex p-1 rounded-xl bg-[#111119] border border-[rgba(255,255,255,0.06)]"
        >
          <button
            onClick={() => setActiveTab('summary')}
            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === 'summary' ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: activeTab === 'summary' ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              color: activeTab === 'summary' ? '#f0eee8' : 'rgba(240,238,232,0.4)',
            }}
          >
            Lista de Intercambio
          </button>
          <button
            onClick={() => setActiveTab('organizer')}
            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: activeTab === 'organizer' ? 'rgba(255,255,255,0.04)' : 'transparent',
              border: activeTab === 'organizer' ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              color: activeTab === 'organizer' ? '#FAC71E' : 'rgba(240,238,232,0.4)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FAC71E' }} />
            Organizador Visual
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <>
          {/* Repeated section */}
          <div className="px-4 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
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
              <button
                onClick={() => {
                  const listText = repeatedList.map(g => `${g.team}: ${g.codes.join(', ')}`).join('\n');
                  if (!listText) {
                    setToast('No tienes repetidas para copiar');
                    setTimeout(() => setToast(null), 2000);
                    return;
                  }
                  navigator.clipboard.writeText(listText);
                  setToast('📋 ¡Lista de repetidas copiada!');
                  setTimeout(() => setToast(null), 2000);
                }}
                className="text-[11px] font-body font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(240,238,232,0.6)'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v2a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2M10 4V2a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                </svg>
                Copiar
              </button>
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
                <button onClick={() => setActiveTab('organizer')} className="mt-2 text-xs font-semibold text-[#FAC71E] underline bg-transparent border-none cursor-pointer">
                  Ir al Organizador Visual
                </button>
              </div>
            )}
          </div>

          {/* Missing section */}
          <div className="px-4 pt-6 pb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[18px] tracking-wide text-[#f0eee8]">
                  ME FALTAN (EN MI ALBUM)
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
              <button
                onClick={() => {
                  const listText = missingList.map(g => `${g.team}: ${g.codes.join(', ')}`).join('\n');
                  if (!listText) {
                    setToast('¡Álbum completo! No te faltan cromos');
                    setTimeout(() => setToast(null), 2000);
                    return;
                  }
                  navigator.clipboard.writeText(listText);
                  setToast('📋 ¡Lista de faltantes copiada!');
                  setTimeout(() => setToast(null), 2000);
                }}
                className="text-[11px] font-body font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(240,238,232,0.6)'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v2a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2M10 4V2a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                </svg>
                Copiar
              </button>
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
                <p className="text-xs text-[rgba(240,238,232,0.35)]">¡Felicitaciones! No te falta ningún cromo.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Interactive Visual Organizer accordion checklist */
        <div className="px-4 pt-4 pb-12 flex flex-col gap-2.5">
          <div className="p-3.5 border border-[rgba(255,203,47,0.12)] rounded-xl bg-[rgba(255,203,47,0.02)] flex gap-2">
            <span className="text-sm">💡</span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-medium text-[rgba(240,238,232,0.85)]">
                Toca cualquier número para cambiar su estado.
              </p>
              <p className="text-[10px] text-[rgba(240,238,232,0.45)]">
                Faltante (gris) ➔ Pegada (verde) ➔ Repetida (dorado con cantidad).
              </p>
            </div>
          </div>

          {SECTIONS.map(section => {
            const isExpanded = expandedSection === section.code;
            
            // Calculate progress for this section
            let ownedCount = 0;
            for (let i = 1; i <= section.total; i++) {
              const code = `${section.code}${i}`;
              const entry = statusMap[code];
              if (entry && (entry.status === 'owned' || entry.status === 'repeated')) {
                ownedCount++;
              }
            }
            
            return (
              <div 
                key={section.code} 
                className="border rounded-2xl overflow-hidden transition-all bg-[#111119]"
                style={{
                  borderColor: isExpanded ? 'rgba(250,199,30,0.22)' : 'rgba(255,255,255,0.06)',
                }}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.code)}
                  className="w-full px-4 py-3.5 flex items-center justify-between transition-colors active:bg-white/[0.01]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{section.flag}</span>
                    <span className="text-xs font-bold text-[#f0eee8] text-left">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[rgba(240,238,232,0.6)]">
                      {ownedCount}/{section.total} pegadas
                    </span>
                    <svg 
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
                      className={`transition-transform duration-200 text-[rgba(240,238,232,0.4)] ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </button>
                
                {/* Expanded sticker grid */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[rgba(255,255,255,0.04)] bg-[#0c0c14]">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: section.total }, (_, i) => {
                        const number = i + 1;
                        const code = `${section.code}${number}`;
                        const entry = statusMap[code];
                        const status = entry?.status || 'wanted';
                        const quantity = entry?.quantity || 0;
                        
                        let bg = 'rgba(255,255,255,0.02)';
                        let border = '1px solid rgba(255,255,255,0.06)';
                        let text = 'rgba(240,238,232,0.3)';
                        
                        if (status === 'owned') {
                          bg = 'rgba(74,222,128,0.08)';
                          border = '1.5px solid #4ade80';
                          text = '#4ade80';
                        } else if (status === 'repeated') {
                          bg = 'rgba(250,199,30,0.1)';
                          border = '1.5px solid #FAC71E';
                          text = '#FAC71E';
                        }
                        
                        const isConfigOpen = activeConfigCode === code;
                        
                        return (
                          <div key={code} className="relative">
                            <button
                              onClick={() => setActiveConfigCode(isConfigOpen ? null : code)}
                              className="w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all active:scale-95 text-xs font-mono relative"
                              style={{ background: bg, border, color: text }}
                            >
                              <span className="font-bold">{number}</span>
                              {status === 'repeated' && (
                                <span 
                                  className="absolute -top-1.5 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full border"
                                  style={{ 
                                    background: '#FAC71E', 
                                    color: '#08080e',
                                    borderColor: '#08080e',
                                    transform: 'scale(0.85)'
                                  }}
                                >
                                  x{quantity}
                                </span>
                              )}
                            </button>
                            
                            {/* Inline status config panel */}
                            {isConfigOpen && (
                              <div 
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-30 p-2 flex flex-col gap-1.5 rounded-xl border shadow-2xl animate-toast-in"
                                style={{ 
                                  background: '#161624', 
                                  borderColor: 'rgba(255,255,255,0.12)',
                                  minWidth: '150px'
                                }}
                              >
                                <div className="text-[10px] text-[rgba(240,238,232,0.4)] text-center font-mono border-b border-white/5 pb-1 font-bold">
                                  {code}
                                </div>
                                <div className="flex gap-1 justify-between">
                                  {/* Toggle Wanted (missing) */}
                                  <button
                                    onClick={() => {
                                      handleStickerStatusChange(code, 'wanted', 0);
                                      setActiveConfigCode(null);
                                    }}
                                    className="flex-1 py-1.5 rounded-lg flex flex-col items-center justify-center gap-1 active:scale-90 transition-all hover:bg-white/5"
                                  >
                                    <span className="text-sm">❌</span>
                                    <span className="text-[9px] text-[rgba(240,238,232,0.5)]">Falta</span>
                                  </button>
                                  
                                  {/* Toggle Owned */}
                                  <button
                                    onClick={() => {
                                      handleStickerStatusChange(code, 'owned', 1);
                                      setActiveConfigCode(null);
                                    }}
                                    className="flex-1 py-1.5 rounded-lg flex flex-col items-center justify-center gap-1 active:scale-90 transition-all hover:bg-white/5"
                                  >
                                    <span className="text-sm">✅</span>
                                    <span className="text-[9px] text-[#4ade80]">Tengo</span>
                                  </button>
                                  
                                  {/* Toggle Repeated */}
                                  <button
                                    onClick={() => {
                                      const newQty = status === 'repeated' ? quantity + 1 : 2;
                                      handleStickerStatusChange(code, 'repeated', newQty);
                                    }}
                                    className="flex-1 py-1.5 rounded-lg flex flex-col items-center justify-center gap-1 active:scale-90 transition-all hover:bg-white/5"
                                  >
                                    <span className="text-sm">🔁</span>
                                    <span className="text-[9px] text-[#FAC71E]">Repetida</span>
                                  </button>
                                </div>

                                {status === 'repeated' && (
                                  <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-0.5">
                                    <span className="text-[9px] text-[rgba(240,238,232,0.4)]">Cantidad:</span>
                                    <div className="flex gap-1.5 items-center">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (quantity > 2) {
                                            handleStickerStatusChange(code, 'repeated', quantity - 1);
                                          } else {
                                            handleStickerStatusChange(code, 'owned', 1);
                                            setActiveConfigCode(null);
                                          }
                                        }}
                                        className="w-4 h-4 flex items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white hover:bg-white/15"
                                      >
                                        -
                                      </button>
                                      <span className="text-[10px] font-mono font-bold text-[#FAC71E] min-w-[12px] text-center">{quantity}</span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStickerStatusChange(code, 'repeated', quantity + 1);
                                        }}
                                        className="w-4 h-4 flex items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white hover:bg-white/15"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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

      {/* Dev Console Bottom Sheet Modal */}
      {isConsoleOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[8px] animate-fade-in"
            onClick={() => setIsConsoleOpen(false)}
          />
          {/* Console Bottom Sheet */}
          <div className="relative w-full max-w-md bg-[#090911] border-t border-[rgba(255,203,47,0.25)] rounded-t-[32px] p-6 pb-12 sm:pb-8 animate-slide-up z-10 flex flex-col gap-4 shadow-2xl">
            {/* Grabber indicator */}
            <div className="w-12 h-1.5 bg-[rgba(255,203,47,0.3)] rounded-full mx-auto" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFCB2F" strokeWidth="2.5">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                <h3 className="font-display text-[18px] tracking-wider text-[#FFCB2F] uppercase">
                  Consola de Desarrollo
                </h3>
              </div>
              <button
                onClick={() => setIsConsoleOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[rgba(240,238,232,0.6)] active:scale-90 transition-all"
                style={{ cursor: 'pointer' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Log Terminal Screen */}
            <div 
              className="w-full h-48 bg-[#040408] rounded-xl p-3 font-mono text-[11px] overflow-y-auto border border-[rgba(255,255,255,0.05)] flex flex-col gap-1 text-emerald-400"
              style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)' }}
            >
              {consoleLog.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {log.startsWith('>') ? (
                    <span className="text-zinc-500">{log}</span>
                  ) : log.startsWith('Error') || log.startsWith('Opción') ? (
                    <span className="text-rose-400">{log}</span>
                  ) : log.startsWith('Exito') || log.startsWith('Cargado') || log.startsWith('¡') ? (
                    <span className="text-amber-300">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleConsoleSubmit} className="flex gap-2">
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder="Escribe un comando... (ej: /help)"
                className="flex-1 px-4 py-3 bg-[#11111f] border border-[rgba(255,203,47,0.15)] rounded-xl text-xs font-mono focus:outline-none focus:border-[#FFCB2F] text-[#f0eee8]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-3 bg-[#FFCB2F] text-[#08080e] rounded-xl font-body font-bold text-xs active:scale-95 transition-all"
                style={{ cursor: 'pointer' }}
              >
                Enviar
              </button>
            </form>
            
            {/* Quick Helper Pills */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {['/help', '/reset', '/fill 50', '/repeated 10', '/missing 10'].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => setConsoleInput(cmd)}
                  className="px-2 py-1 rounded bg-[rgba(255,203,47,0.06)] border border-[rgba(255,203,47,0.15)] text-[10px] font-mono text-[#FFCB2F] hover:bg-[rgba(255,203,47,0.1)] active:scale-95"
                  style={{ cursor: 'pointer' }}
                >
                  {cmd}
                </button>
              ))}
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
