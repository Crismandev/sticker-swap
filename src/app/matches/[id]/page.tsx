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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Scroll to bottom ──────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // ── Send Message Handler ──────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;

    const content = text.trim();
    setText('');

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
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-[#f0eee8] overflow-hidden">
      {/* ── Chat Header ────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]"
        style={{
          background: 'rgba(14, 14, 22, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/matches"
            className="flex items-center justify-center w-9 h-9 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] active:scale-95 transition-all"
            style={{ borderRadius: 10 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f0eee8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13L5 8l5-5" />
            </svg>
          </Link>

          <Avatar initials={matchInfo.otherInitials} size={40} colorIndex={3} />

          <div>
            <h4 className="font-display text-[17px] leading-tight text-[#f0eee8]">
              {matchInfo.otherName.toUpperCase()}
            </h4>
            {matchInfo.otherCity && (
              <span className="text-[10px] text-[rgba(240,238,232,0.4)] block">
                📍 {matchInfo.otherCity}
              </span>
            )}
          </div>
        </div>

        {/* Match score badge */}
        <div
          className="px-2.5 py-1 text-center"
          style={{
            background: 'rgba(250,199,30,0.08)',
            border: '0.5px solid rgba(250,199,30,0.2)',
            borderRadius: 10,
          }}
        >
          <span className="font-display text-xs text-[#FAC71E] block">
            {matchInfo.score} pts
          </span>
        </div>
      </div>

      {/* ── Swap helper header drawer ───────────────────────── */}
      <div
        className="flex-shrink-0 px-4 py-2 bg-[#111119] border-b border-[rgba(255,255,255,0.05)] flex flex-col gap-1.5"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-[rgba(240,238,232,0.3)]">
            Detalles de Intercambio
          </span>
          <span className="text-[9px] tracking-wide text-[#FAC71E] font-mono">
            pixelia - crisman
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-[#4ade80] font-medium block">
              Entregas ({myGiveCodes.length})
            </span>
            <div className="flex flex-wrap gap-1 mt-0.5 max-h-12 overflow-y-auto custom-scrollbar">
              {myGiveCodes.length > 0 ? (
                myGiveCodes.map((code) => (
                  <span key={code} className="text-[9px] font-display font-semibold px-1 rounded" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
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
            <div className="flex flex-wrap gap-1 mt-0.5 max-h-12 overflow-y-auto custom-scrollbar">
              {myReceiveCodes.length > 0 ? (
                myReceiveCodes.map((code) => (
                  <span key={code} className="text-[9px] font-display font-semibold px-1 rounded" style={{ background: 'rgba(250,199,30,0.12)', color: '#FAC71E' }}>
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

      {/* ── Messages Container ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#08080c] scroll-smooth">
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
          messages.map((msg) => {
            const isMe = msg.sender_id === userId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div
                  className="px-3.5 py-2.5 text-sm font-body leading-normal"
                  style={{
                    background: isMe
                      ? '#FAC71E'
                      : '#161622',
                    color: isMe ? '#0a0a0f' : '#f0eee8',
                    borderRadius: isMe
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[8px] text-[rgba(240,238,232,0.25)] mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ──────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="flex-shrink-0 px-4 py-3 bg-[#0e0e16] border-t border-[rgba(255,255,255,0.06)] flex items-center gap-2 pb-safe"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-3 bg-[#161622] border border-[rgba(255,255,255,0.08)] rounded-xl text-sm focus:outline-none focus:border-[#FAC71E] transition-all font-body text-[#f0eee8] placeholder-[rgba(240,238,232,0.25)]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-11 h-11 flex items-center justify-center bg-[#FAC71E] active:scale-95 transition-all text-[#0a0a0f] disabled:opacity-40 disabled:scale-100"
          style={{ borderRadius: 12 }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px]">
            <path d="M15 1L1 8l6 1 1 6 7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
