'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Avatar from '@/components/ui/Avatar';

type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type MatchDetails = {
  id: string;
  otherId: string;
  otherName: string;
  otherInitials: string;
  otherCity: string;
  canGive: number;
  canReceive: number;
  score: number;
};

export default function MatchChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchDetails | null>(null);
  const [myGiveCodes, setMyGiveCodes] = useState<string[]>([]);
  const [myReceiveCodes, setMyReceiveCodes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  // Attachment and Mock features states
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);

  // Calling States
  const [callingType, setCallingType] = useState<'voice' | 'video' | null>(null);
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Scroll to bottom ──────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Call Timer Effect ─────────────────────────────────
  useEffect(() => {
    if (callingType && callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callingType, callState]);

  // ── Simulated Connection for Call ─────────────────────
  useEffect(() => {
    if (callingType && callState === 'ringing') {
      setCallDuration(0);
      const connTimeout = setTimeout(() => {
        setCallState('connected');
      }, 2500);
      return () => clearTimeout(connTimeout);
    }
  }, [callingType, callState]);

  // ── Load match info, messages and current user ─────────
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      // Load Match Details
      const { data: matchData } = await supabase
        .from('swap_matches')
        .select(`
          id, match_score, can_give, can_receive,
          user_a:users!swap_matches_user_a_id_fkey(id, display_name, username, city),
          user_b:users!swap_matches_user_b_id_fkey(id, display_name, username, city)
        `)
        .eq('id', id)
        .single();

      if (matchData) {
        const match = matchData as any;
        const isA = (Array.isArray(match.user_a) ? match.user_a[0]?.id : match.user_a?.id) === user.id;
        const other = isA
          ? (Array.isArray(match.user_b) ? match.user_b[0] : match.user_b)
          : (Array.isArray(match.user_a) ? match.user_a[0] : match.user_a);
        const name = other?.display_name || other?.username || 'Usuario';

        setMatchInfo({
          id: match.id,
          otherId: other?.id || '',
          otherName: name,
          otherInitials: name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
          otherCity: other?.city || '',
          canGive: isA ? match.can_give : match.can_receive,
          canReceive: isA ? match.can_receive : match.can_give,
          score: match.match_score,
        });

        // Load specific sticker codes swap details
        // 1. Stickers I can give them (my repeated, their wanted)
        const { data: myRepeated } = await supabase
          .from('user_stickers')
          .select('stickers(code)')
          .eq('user_id', user.id)
          .eq('status', 'repeated');

        const { data: otherWanted } = await supabase
          .from('user_stickers')
          .select('stickers(code)')
          .eq('user_id', other?.id)
          .eq('status', 'wanted');

        const myRepCodes = (myRepeated || []).map((r: any) => r.stickers?.code || r.stickers?.[0]?.code).filter(Boolean);
        const otherWntCodes = (otherWanted || []).map((r: any) => r.stickers?.code || r.stickers?.[0]?.code).filter(Boolean);
        const gives = myRepCodes.filter((code) => otherWntCodes.includes(code));
        setMyGiveCodes(gives);

        // 2. Stickers I can receive from them (their repeated, my wanted)
        const { data: otherRepeated } = await supabase
          .from('user_stickers')
          .select('stickers(code)')
          .eq('user_id', other?.id)
          .eq('status', 'repeated');

        const { data: myWanted } = await supabase
          .from('user_stickers')
          .select('stickers(code)')
          .eq('user_id', user.id)
          .eq('status', 'wanted');

        const otherRepCodes = (otherRepeated || []).map((r: any) => r.stickers?.code || r.stickers?.[0]?.code).filter(Boolean);
        const myWntCodes = (myWanted || []).map((r: any) => r.stickers?.code || r.stickers?.[0]?.code).filter(Boolean);
        const receives = otherRepCodes.filter((code) => myWntCodes.includes(code));
        setMyReceiveCodes(receives);
      }

      // Load initial Messages
      const { data: msgData } = await supabase
        .from('swap_messages')
        .select('*')
        .eq('match_id', id)
        .order('created_at', { ascending: true });

      if (msgData) {
        setMessages(msgData);
      }

      setLoading(false);
    });
  }, [id]);

  // ── Subscribe to Realtime Messages ─────────────────────
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`match_chat:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'swap_messages',
          filter: `match_id=eq.${id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // ── Send Message Helper ────────────────────────────────
  const sendMessage = async (content: string) => {
    if (!userId) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('swap_messages')
      .insert({
        match_id: id,
        sender_id: userId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
    } else if (data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    await sendMessage(content);
  };

  // ── Call Handler Actions ───────────────────────────────
  const startCall = (type: 'voice' | 'video') => {
    setCallingType(type);
    setCallState('ringing');
  };

  const endCall = async () => {
    if (!callingType) return;
    const finalDuration = callDuration;
    const isConnected = callState === 'connected';

    setCallingType(null);
    setCallState('ended');

    // Create log message inside the database
    const logContent = isConnected 
      ? `[LLAMADA_FINALIZADA] ${finalDuration}s` 
      : `[LLAMADA_PERDIDA]`;
    await sendMessage(logContent);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-pulse-dot w-2 h-2 rounded-full" style={{ background: '#FAC71E' }} />
      </div>
    );
  }

  if (!matchInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0f] p-4 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="font-display text-[22px] text-[#f0eee8]">MATCH NO ENCONTRADO</p>
        <Link href="/matches" className="px-5 py-2.5 bg-[#FAC71E] text-[#0a0a0f] font-semibold rounded-xl text-sm transition-all active:scale-[0.98]">
          Volver a matches
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[100dvh] w-full max-w-md md:max-w-2xl mx-auto bg-[#08080c] text-[#f0eee8] overflow-hidden border-x border-[rgba(255,255,255,0.06)] font-body">
      <style>{`
        .chat-wallpaper {
          background-color: #08080c;
          background-image: 
            radial-gradient(rgba(250, 199, 30, 0.015) 1.5px, transparent 1.5px),
            radial-gradient(rgba(255, 255, 255, 0.01) 1.5px, transparent 1.5px);
          background-size: 32px 32px;
          background-position: 0 0, 16px 16px;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        .animate-pulse-ring {
          animation: pulseRing 2.2s infinite ease-in-out;
        }
      `}</style>

      {/* ── Chat Header ────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] relative z-40"
        style={{
          background: 'rgba(14, 14, 22, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Back button arrow */}
          <Link
            href="/matches"
            className="flex items-center justify-center w-8 h-8 rounded-full active:bg-white/5 transition-all text-[rgba(240,238,232,0.85)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>

          {/* Avatar */}
          <Avatar initials={matchInfo.otherInitials} size={38} colorIndex={3} />

          {/* User Details */}
          <div className="ml-1">
            <h4 className="font-bold text-[14px] leading-tight text-[#f0eee8]">
              {matchInfo.otherName}
            </h4>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              en línea
            </span>
          </div>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => startCall('video')}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-white/5 text-[rgba(240,238,232,0.85)] transition-all"
            title="Video call"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          
          <button
            onClick={() => startCall('voice')}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-white/5 text-[rgba(240,238,232,0.85)] transition-all"
            title="Voice call"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
            </svg>
          </button>

          {/* Match Score Badge */}
          <div
            className="px-2 py-1 ml-1 text-center"
            style={{
              background: 'rgba(250,199,30,0.06)',
              border: '1px solid rgba(250,199,30,0.18)',
              borderRadius: 8,
            }}
          >
            <span className="font-mono text-[9px] font-bold text-[#FAC71E] block">
              {matchInfo.score} pts
            </span>
          </div>
        </div>
      </div>

      {/* ── Swap info header drawer ───────────────────────── */}
      <div
        className="flex-shrink-0 px-4 py-2.5 bg-[#111119] border-b border-[rgba(255,255,255,0.05)] flex flex-col gap-1.5 z-10"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-[rgba(240,238,232,0.3)]">
            Detalles de Intercambio
          </span>
          {matchInfo.otherCity && (
            <span className="text-[9px] text-[rgba(240,238,232,0.45)]">
              📍 {matchInfo.otherCity}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-emerald-400 font-medium block">
              Entregas ({myGiveCodes.length})
            </span>
            <div className="flex flex-wrap gap-1 mt-1 max-h-12 overflow-y-auto custom-scrollbar">
              {myGiveCodes.length > 0 ? (
                myGiveCodes.map((code) => (
                  <span key={code} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {code}
                  </span>
                ))
              ) : (
                <span className="text-[9px] text-[rgba(240,238,232,0.25)] italic">Ninguno disponible</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#FAC71E] font-medium block">
              Recibes ({myReceiveCodes.length})
            </span>
            <div className="flex flex-wrap gap-1 mt-1 max-h-12 overflow-y-auto custom-scrollbar">
              {myReceiveCodes.length > 0 ? (
                myReceiveCodes.map((code) => (
                  <span key={code} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAC71E]/10 border border-[#FAC71E]/20 text-[#FAC71E]">
                    {code}
                  </span>
                ))
              ) : (
                <span className="text-[9px] text-[rgba(240,238,232,0.25)] italic">Ninguno disponible</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Messages Container (Chat Wallpaper) ────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 chat-wallpaper scroll-smooth relative z-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
            <span className="text-4xl animate-bounce-slow">👋</span>
            <h5 className="font-display text-[18px] text-[rgba(240,238,232,0.5)]">
              ¡DI HOLA!
            </h5>
            <p className="text-xs text-[rgba(240,238,232,0.3)] max-w-[240px]">
              Coordinen un lugar y hora para intercambiar sus cromos repetidos.
            </p>
          </div>
        ) : (
          <>
            {/* Today Date Pill Separator */}
            <div className="flex justify-center my-2">
              <span 
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border"
                style={{ 
                  background: '#161622', 
                  borderColor: 'rgba(255,255,255,0.06)',
                  color: 'rgba(240,238,232,0.45)' 
                }}
              >
                Hoy
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender_id === userId;
              
              // Render special rich message types
              if (msg.content.startsWith('[LLAMADA_PERDIDA]')) {
                return (
                  <div key={msg.id} className="flex justify-center my-1.5 w-full">
                    <div 
                      className="px-4 py-2.5 rounded-2xl flex items-center gap-3 border shadow-md max-w-[280px]"
                      style={{ 
                        background: '#13131e', 
                        borderColor: 'rgba(239, 68, 68, 0.15)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                        </svg>
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-[#f0eee8]">Llamada de voz perdida</span>
                        <button 
                          onClick={() => startCall('voice')}
                          className="text-[9px] text-[#FFCB2F] text-left font-semibold active:scale-95 transition-all"
                        >
                          Toca para devolver llamada
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.content.startsWith('[LLAMADA_FINALIZADA]')) {
                const duration = msg.content.replace('[LLAMADA_FINALIZADA]', '').trim();
                return (
                  <div key={msg.id} className="flex justify-center my-1.5 w-full">
                    <div 
                      className="px-4 py-2.5 rounded-2xl flex items-center gap-3 border shadow-md max-w-[280px]"
                      style={{ 
                        background: '#13131e', 
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[rgba(240,238,232,0.6)]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                        </svg>
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-[#f0eee8]">Llamada finalizada</span>
                        <span className="text-[9px] text-[rgba(240,238,232,0.45)] font-mono">Duración: {duration}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.content.startsWith('[MAPA]')) {
                const address = msg.content.replace('[MAPA]', '').trim();
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div
                      className="p-1 rounded-2xl border shadow-lg overflow-hidden flex flex-col"
                      style={{
                        background: isMe ? '#222216' : '#161622',
                        borderColor: isMe ? 'rgba(250,199,30,0.22)' : 'rgba(255,255,255,0.06)',
                        width: '240px'
                      }}
                    >
                      {/* Fake Map Graphic */}
                      <div className="h-28 w-full bg-[#1b1b2a] relative flex items-center justify-center overflow-hidden rounded-t-xl">
                        {/* Map Grid Pattern */}
                        <div className="absolute inset-0 opacity-15" style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                          backgroundSize: '12px 12px'
                        }} />
                        {/* Styled roads lines */}
                        <div className="absolute w-[200%] h-1 bg-white/10 rotate-[25deg] top-1/3 left-[-50%]" />
                        <div className="absolute w-[200%] h-1 bg-white/10 rotate-[-15deg] top-2/3 left-[-50%]" />
                        <div className="absolute w-1 h-[200%] bg-white/10 top-[-50%] left-1/3" />
                        {/* Gold pulse pin */}
                        <div className="relative z-10 w-9 h-9 rounded-full bg-[#FAC71E]/20 flex items-center justify-center animate-bounce">
                          <span className="text-lg">📍</span>
                        </div>
                      </div>
                      
                      <div className="p-3 flex flex-col gap-1 text-left">
                        <span className="text-[11px] font-bold text-[#FAC71E] uppercase tracking-wider">
                          Ubicación de Intercambio
                        </span>
                        <span className="text-[11px] text-[rgba(240,238,232,0.8)] font-medium truncate">
                          {address}
                        </span>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-[10px] font-bold text-center text-[#f0eee8] transition-all border border-white/5"
                        >
                          Ver en Google Maps
                        </a>
                      </div>
                    </div>
                    <span className="text-[8px] text-[rgba(240,238,232,0.25)] mt-1 px-1 flex items-center gap-1 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <span className="text-[#34B7F1]">✓✓</span>}
                    </span>
                  </div>
                );
              }

              if (msg.content.startsWith('[FOTO]')) {
                const label = msg.content.replace('[FOTO]', '').trim();
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div
                      className="p-1 rounded-2xl border shadow-lg overflow-hidden flex flex-col"
                      style={{
                        background: isMe ? '#222216' : '#161622',
                        borderColor: isMe ? 'rgba(250,199,30,0.22)' : 'rgba(255,255,255,0.06)',
                        width: '240px'
                      }}
                    >
                      {/* Simulated photo/render box */}
                      <div className="h-32 w-full bg-gradient-to-br from-[#1c1c28] to-[#12121a] relative flex flex-col items-center justify-center p-3 overflow-hidden rounded-t-xl border-b border-white/5">
                        <span className="text-3xl mb-1.5 animate-pulse-ring">📦</span>
                        {/* Fake sticker grid */}
                        <div className="flex gap-1">
                          <span className="text-[9px] font-mono font-bold bg-[#FAC71E]/20 text-[#FAC71E] border border-[#FAC71E]/30 px-1 py-0.5 rounded">MEX5</span>
                          <span className="text-[9px] font-mono font-bold bg-[#FAC71E]/20 text-[#FAC71E] border border-[#FAC71E]/30 px-1 py-0.5 rounded">GER12</span>
                          <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded">ARG10</span>
                        </div>
                      </div>
                      
                      <div className="p-3 flex items-center gap-2 text-left">
                        <span className="text-base">📷</span>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#f0eee8] leading-tight">
                            {label || 'Cromos repetidos.jpg'}
                          </span>
                          <span className="text-[9px] text-[rgba(240,238,232,0.4)]">Imagen de intercambio</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[8px] text-[rgba(240,238,232,0.25)] mt-1 px-1 flex items-center gap-1 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <span className="text-[#34B7F1]">✓✓</span>}
                    </span>
                  </div>
                );
              }

              // Standard Text Message
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[72%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div
                    className="px-3.5 py-2.5 text-sm font-body leading-normal relative border"
                    style={{
                      background: isMe
                        ? 'linear-gradient(135deg, #FFD147 0%, #FAC71E 100%)'
                        : '#161622',
                      borderColor: isMe
                        ? 'rgba(250,199,30,0.1)'
                        : 'rgba(255,255,255,0.05)',
                      color: isMe ? '#08080c' : '#f0eee8',
                      borderRadius: isMe
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    {/* Tail Effect */}
                    <div 
                      className="absolute bottom-0 w-2.5 h-2.5"
                      style={{
                        right: isMe ? '-4px' : 'auto',
                        left: isMe ? 'auto' : '-4px',
                        background: isMe ? '#FAC71E' : '#161622',
                        clipPath: isMe 
                          ? 'polygon(0 0, 0 100%, 100% 100%)'
                          : 'polygon(100% 0, 0 100%, 100% 100%)',
                        display: 'none' /* Tail can be enabled/disabled */
                      }}
                    />

                    <p className="whitespace-pre-wrap text-[13px] font-medium leading-relaxed">{msg.content}</p>
                    
                    {/* Timestamp + ticks inside bubble */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-mono text-right opacity-60 leading-none">
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-[#34B7F1] ml-0.5">
                          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M10.354 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L3 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Attachment slide-up sheet ─────────────────────── */}
      {showAttachmentMenu && (
        <div 
          className="absolute left-4 right-4 bottom-20 z-50 p-4 rounded-3xl border shadow-2xl animate-toast-in flex justify-around gap-4"
          style={{ 
            background: '#12121a', 
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {/* Photos Option */}
          <button
            onClick={() => {
              sendMessage('[FOTO] Foto de repetidas');
              setShowAttachmentMenu(false);
            }}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-500 border border-violet-500/20 text-lg">
              📷
            </div>
            <span className="text-[10px] text-[rgba(240,238,232,0.7)] font-medium">Compartir Foto</span>
          </button>
          
          {/* Map Location Option */}
          <button
            onClick={() => {
              sendMessage('[MAPA] Parque Kennedy, Miraflores (Lima)');
              setShowAttachmentMenu(false);
            }}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 text-lg">
              📍
            </div>
            <span className="text-[10px] text-[rgba(240,238,232,0.7)] font-medium">Compartir Mapa</span>
          </button>

          {/* Quick Swap Codes Attachment */}
          <button
            onClick={() => {
              if (myGiveCodes.length > 0) {
                sendMessage(`¡Hola! Tengo disponibles para ti estos cromos: ${myGiveCodes.slice(0, 5).join(', ')}${myGiveCodes.length > 5 ? '...' : ''}`);
              } else {
                sendMessage('Aún estoy revisando mi lista de repetidas.');
              }
              setShowAttachmentMenu(false);
            }}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAC71E]/10 flex items-center justify-center text-[#FAC71E] border border-[#FAC71E]/20 text-lg">
              ⚽
            </div>
            <span className="text-[10px] text-[rgba(240,238,232,0.7)] font-medium">Enviar Mis Cromos</span>
          </button>
        </div>
      )}

      {/* ── Emoji fast selector bubble ───────────────────── */}
      {showEmojiMenu && (
        <div 
          className="absolute left-4 right-4 bottom-20 z-50 p-2.5 rounded-2xl border shadow-2xl animate-toast-in flex justify-around gap-2 text-xl"
          style={{ 
            background: '#12121a', 
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {['👋', '⚽', '👍', '😊', '🤝', '🔥', '📍'].map((emoji) => (
            <button 
              key={emoji}
              onClick={() => {
                setText((prev) => prev + emoji);
                setShowEmojiMenu(false);
              }}
              className="hover:scale-125 active:scale-90 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Bar (WhatsApp Style Layout) ───────────────── */}
      <form
        onSubmit={handleSend}
        className="flex-shrink-0 px-3 py-3.5 bg-[#0a0a0f] border-t border-[rgba(255,255,255,0.05)] flex items-center gap-2 relative z-30 pb-[calc(1.1rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* Attachment "+" Trigger */}
        <button
          type="button"
          onClick={() => {
            setShowAttachmentMenu((prev) => !prev);
            setShowEmojiMenu(false);
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-[rgba(240,238,232,0.75)] active:bg-white/5 transition-all text-xl ${showAttachmentMenu ? 'rotate-45 text-[#FAC71E]' : ''}`}
        >
          ＋
        </button>

        {/* Text Input Pill */}
        <div className="flex-1 flex items-center bg-[#13131e] border border-[rgba(255,255,255,0.05)] rounded-full px-4 py-1.5 focus-within:border-[#FAC71E]/50 transition-all shadow-inner">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (showEmojiMenu) setShowEmojiMenu(false);
              if (showAttachmentMenu) setShowAttachmentMenu(false);
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent py-2.5 text-[14px] focus:outline-none font-body text-[#f0eee8] placeholder-[rgba(240,238,232,0.3)]"
          />
          
          {/* Emoji button inside input */}
          <button
            type="button"
            onClick={() => {
              setShowEmojiMenu((prev) => !prev);
              setShowAttachmentMenu(false);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full active:bg-white/5 text-[rgba(240,238,232,0.5)] hover:text-[#FAC71E] transition-all ml-1.5"
          >
            😀
          </button>
        </div>

        {/* Dynamic Send / Microphone Button */}
        {text.trim() ? (
          <button
            type="submit"
            className="w-11 h-11 flex items-center justify-center bg-[#FAC71E] active:scale-90 hover:scale-105 transition-all text-[#0a0a0f] rounded-full flex-shrink-0 shadow-lg shadow-[#FAC71E]/10"
            style={{ cursor: 'pointer' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[0.5px]">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={async () => {
              // Send mock audio log message
              await sendMessage('[LLAMADA_FINALIZADA] Nota de voz (0:08)');
            }}
            className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/5 active:scale-90 transition-all text-[rgba(240,238,232,0.65)] rounded-full flex-shrink-0"
            title="Send audio note"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        )}
      </form>

      {/* ── Fullscreen Simulated Calling Overlay ───────────────── */}
      {callingType && (
        <div 
          className="absolute inset-0 z-[100] flex flex-col justify-between items-center py-20 animate-fade-in"
          style={{
            background: 'radial-gradient(ellipse at top, #1c1c30 0%, #08080f 100%)',
          }}
        >
          {/* Subtle light/stadium graphic elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FAC71E]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Caller Details Header */}
          <div className="flex flex-col items-center gap-2 relative z-10">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#FAC71E] opacity-70">
              Llamada de Sticker Swap
            </span>
            <h2 className="text-2xl font-bold text-[#f0eee8] mt-2">
              {matchInfo.otherName}
            </h2>
            <span className="text-xs text-[rgba(240,238,232,0.45)] font-medium">
              {callState === 'ringing' ? 'Llamando...' : `Conectado • ${formatDuration(callDuration)}`}
            </span>
          </div>

          {/* Avatar pulsing */}
          <div className="relative w-44 h-44 flex items-center justify-center relative z-10">
            {/* Multi-layered pulsing gold ring */}
            <div className="absolute inset-0 rounded-full border border-[#FAC71E]/40 animate-pulse-ring" style={{ animationDelay: '0s' }} />
            <div className="absolute inset-2 rounded-full border border-[#FAC71E]/20 animate-pulse-ring" style={{ animationDelay: '0.8s' }} />
            <Avatar initials={matchInfo.otherInitials} size={130} colorIndex={3} />
          </div>

          {/* Call Controls Footer */}
          <div className="flex flex-col items-center gap-6 relative z-10">
            {callingType === 'video' && (
              <span className="text-[10px] text-[rgba(240,238,232,0.35)] px-3 py-1 rounded bg-white/5 border border-white/5">
                📷 Cámara activa (Simulador)
              </span>
            )}
            
            {/* Hangup Red Button */}
            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-red-600/25"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" className="rotate-[135deg] origin-center translate-x-[-1px] translate-y-[-1px]" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
