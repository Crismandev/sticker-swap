'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type ParsedItem = {
  code: string;
  quantity: number;
};

export default function QuickManagePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [wantedText, setWantedText] = useState('');
  const [repeatedText, setRepeatedText] = useState('');
  const [saveMode, setSaveMode] = useState<'append' | 'overwrite'>('append');
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [dbStickers, setDbStickers] = useState<Record<string, string>>({}); // code -> id lookup
  const [loading, setLoading] = useState(true);

  // ── Load Sticker database for fast code lookup ───────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Load all valid sticker codes & IDs from db
      const { data } = await supabase
        .from('stickers')
        .select('id, code');

      if (data) {
        const lookup: Record<string, string> = {};
        data.forEach((s) => {
          lookup[s.code.toUpperCase()] = s.id;
        });
        setDbStickers(lookup);

        // Populate initial values from database to make editing easy
        const { data: userStickers } = await supabase
          .from('user_stickers')
          .select('status, quantity, stickers(code)')
          .eq('user_id', user.id);

        if (userStickers) {
          const wantedCodes: string[] = [];
          const repeatedCodes: string[] = [];

          userStickers.forEach((row: any) => {
            const sticker = Array.isArray(row.stickers) ? row.stickers[0] : row.stickers;
            if (!sticker) return;
            const code = sticker.code;

            if (row.status === 'wanted') {
              wantedCodes.push(code);
            } else if (row.status === 'repeated') {
              const qtySuffix = row.quantity > 1 ? ` x${row.quantity}` : '';
              repeatedCodes.push(`${code}${qtySuffix}`);
            }
          });

          setWantedText(wantedCodes.join(', '));
          setRepeatedText(repeatedCodes.join(', '));
        }
      }
      setLoading(false);
    });
  }, []);

  // ── Parser logic ──────────────────────────────────────
  const parseCodes = (text: string): ParsedItem[] => {
    // Matches patterns like: ARG3, ARG3 x2, ARG3(3), FWC12
    const regex = /\b([A-Z]{3}\d{1,2})\b(?:\s*(?:x|\*|\()\s*(\d+)\)?)?/gi;
    const matches: ParsedItem[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const code = match[1].toUpperCase();
      const quantity = match[2] ? parseInt(match[2], 10) : 1;
      matches.push({ code, quantity });
    }
    return matches;
  };

  const parsedWanted = parseCodes(wantedText);
  const parsedRepeated = parseCodes(repeatedText);

  // Validate matches
  const getValidationStats = (items: ParsedItem[]) => {
    let validCount = 0;
    let invalidCount = 0;
    const invalidCodes: string[] = [];

    items.forEach((item) => {
      if (dbStickers[item.code]) {
        validCount++;
      } else {
        invalidCount++;
        invalidCodes.push(item.code);
      }
    });

    return { validCount, invalidCount, invalidCodes };
  };

  const wantedStats = getValidationStats(parsedWanted);
  const repeatedStats = getValidationStats(parsedRepeated);

  // ── Submit / Save handler ──────────────────────────────
  const handleSave = () => {
    if (!userId) return;

    startTransition(async () => {
      const supabase = createClient();

      try {
        // Filter out invalid items
        const cleanWanted = parsedWanted.filter(item => dbStickers[item.code]);
        const cleanRepeated = parsedRepeated.filter(item => dbStickers[item.code]);

        // ── 1. Handle Overwrite logic ──
        if (saveMode === 'overwrite') {
          // Overwrite mode deletes all previous user entries for wanted & repeated
          await supabase
            .from('user_stickers')
            .delete()
            .eq('user_id', userId)
            .in('status', ['wanted', 'repeated']);
        }

        // ── 2. Batch inserts for Wanted (Faltantes) ──
        const wantedRows = cleanWanted.map((item) => ({
          user_id: userId,
          sticker_id: dbStickers[item.code],
          status: 'wanted',
          quantity: 1,
        }));

        // ── 3. Batch inserts for Repeated (Sobrantes) ──
        const repeatedRows = cleanRepeated.map((item) => ({
          user_id: userId,
          sticker_id: dbStickers[item.code],
          status: 'repeated',
          quantity: item.quantity,
        }));

        const processRows = async (rows: any[]) => {
          for (const row of rows) {
            const { data: existing } = await supabase
              .from('user_stickers')
              .select('id')
              .eq('user_id', row.user_id)
              .eq('sticker_id', row.sticker_id)
              .maybeSingle();

            if (existing) {
              const { error: updateErr } = await supabase
                .from('user_stickers')
                .update({ status: row.status, quantity: row.quantity, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
              if (updateErr) console.error('Update error:', updateErr);
            } else {
              const { error: insertErr } = await supabase
                .from('user_stickers')
                .insert(row);
              if (insertErr) {
                // Fallback attempt for missing profile
                if (insertErr.code === '23503') {
                  await supabase.from('users').insert({
                    id: row.user_id,
                    email: `user_${row.user_id.substring(0,6)}@swap.local`,
                    username: `user_${row.user_id.substring(0,8)}`,
                    display_name: 'Sticker Collector'
                  });
                  await supabase.from('user_stickers').insert(row);
                } else {
                  console.error('Insert error:', insertErr);
                }
              }
            }
          }
        };

        // Process wanted rows
        if (wantedRows.length > 0) {
          await processRows(wantedRows);
        }

        // Process repeated rows
        if (repeatedRows.length > 0) {
          await processRows(repeatedRows);
        }

        setToast('¡Cromos guardados con éxito!');
        setTimeout(() => setToast(null), 2500);
      } catch (err) {
        console.error('Error importing lists:', err);
        setToast('Error al importar la lista');
        setTimeout(() => setToast(null), 2500);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-pulse-dot w-2 h-2 rounded-full" style={{ background: '#FAC71E' }} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0f] p-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(240,238,232,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <p className="font-display text-[22px] text-[#f0eee8]">INICIA SESIÓN</p>
        <p className="text-sm text-[rgba(240,238,232,0.3)]">Para cargar tu lista de faltantes y sobrantes.</p>
        <Link href="/login" className="px-6 py-3 bg-[#FAC71E] text-[#0a0a0f] font-semibold rounded-xl text-sm transition-all active:scale-[0.98] hover:scale-[1.01]" style={{ cursor: 'pointer' }}>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0eee8] pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/album"
          className="flex items-center justify-center w-9 h-9 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] active:scale-95 transition-all rounded-xl"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f0eee8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13L5 8l5-5" />
          </svg>
        </Link>
        <div>
          <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: '#FAC71E' }}>
            ÁLBUM DIGITAL
          </span>
          <span className="font-display text-[26px] leading-none" style={{ color: '#f0eee8' }}>
            CARGA RÁPIDA
          </span>
        </div>
      </div>

      {/* Instructions Accordion */}
      <div
        className="mb-6 p-4 border border-[rgba(255,255,255,0.06)] rounded-2xl bg-[#111119]"
      >
        <h4 className="text-[12px] font-bold text-[#FAC71E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
            <line x1="9" y1="18" x2="15" y2="18"></line>
            <line x1="10" y1="22" x2="14" y2="22"></line>
          </svg>
          Instrucciones de formato
        </h4>
        <p className="text-xs text-[rgba(240,238,232,0.45)] leading-relaxed">
          Pega o escribe tu lista de códigos. El analizador identificará automáticamente los códigos válidos. 
          Ejemplo: <code className="text-[#FAC71E] font-mono bg-[rgba(250,199,30,0.06)] px-1 rounded">ARG1, ARG3 x2, BRA9, FRA20</code>.
          Puedes separarlos por comas, espacios o saltos de línea.
        </p>
      </div>

      {/* Mode settings */}
      <div
        className="mb-6 p-4 border border-[rgba(255,255,255,0.06)] rounded-2xl bg-[#111119] flex flex-col gap-3"
      >
        <span className="text-[10px] uppercase tracking-wider text-[rgba(240,238,232,0.3)]">
          Modo de Guardado
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSaveMode('append')}
            className="py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98]"
            style={{
              background: saveMode === 'append' ? 'rgba(250,199,30,0.1)' : 'transparent',
              borderColor: saveMode === 'append' ? '#FAC71E' : 'rgba(255,255,255,0.08)',
              color: saveMode === 'append' ? '#FAC71E' : 'rgba(240,238,232,0.5)',
            }}
          >
            Agregar (Mantener actuales)
          </button>
          <button
            onClick={() => setSaveMode('overwrite')}
            className="py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98]"
            style={{
              background: saveMode === 'overwrite' ? 'rgba(251,113,133,0.1)' : 'transparent',
              borderColor: saveMode === 'overwrite' ? '#fb7185' : 'rgba(255,255,255,0.08)',
              color: saveMode === 'overwrite' ? '#fb7185' : 'rgba(240,238,232,0.5)',
            }}
          >
            Sobrescribir (Reemplazar todo)
          </button>
        </div>
      </div>

      {/* Dual Column Textareas */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* WANTED PANEL */}
        <div
          className="p-4 border border-[rgba(255,255,255,0.06)] rounded-2xl flex flex-col gap-2.5 bg-[#111119]"
        >
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
            <span className="font-display text-[16px] text-[#fb7185]">
              ME FALTAN (WANTED)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold font-mono">
              {wantedStats.validCount} validos
            </span>
          </div>

          <textarea
            value={wantedText}
            onChange={(e) => setWantedText(e.target.value)}
            placeholder="Pega aquí los cromos que te faltan. Ej: ARG3, BRA4, MEX5..."
            rows={10}
            className="w-full p-3.5 bg-[#161622] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs font-mono focus:outline-none focus:border-[#fb7185] transition-all text-[#f0eee8] resize-none"
          />

          {wantedStats.invalidCount > 0 && (
            <div className="text-[10px] text-rose-400 bg-rose-500/5 p-2 rounded-lg border border-rose-500/15 max-h-16 overflow-y-auto">
              Ignorados/Inválidos: {wantedStats.invalidCodes.join(', ')}
            </div>
          )}
        </div>

        {/* REPEATED PANEL */}
        <div
          className="p-4 border border-[rgba(255,255,255,0.06)] rounded-2xl flex flex-col gap-2.5 bg-[#111119]"
        >
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
            <span className="font-display text-[16px] text-[#4ade80]">
              ME SOBRAN (REPEATED)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold font-mono">
              {repeatedStats.validCount} validos
            </span>
          </div>

          <textarea
            value={repeatedText}
            onChange={(e) => setRepeatedText(e.target.value)}
            placeholder="Pega aquí los cromos repetidos. Ej: FRA3 x2, ARG7, ESP12..."
            rows={10}
            className="w-full p-3.5 bg-[#161622] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs font-mono focus:outline-none focus:border-[#4ade80] transition-all text-[#f0eee8] resize-none"
          />

          {repeatedStats.invalidCount > 0 && (
            <div className="text-[10px] text-rose-400 bg-rose-500/5 p-2 rounded-lg border border-rose-500/15 max-h-16 overflow-y-auto">
              Ignorados/Inválidos: {repeatedStats.invalidCodes.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isPending || (parsedWanted.length === 0 && parsedRepeated.length === 0)}
        className="w-full py-3.5 bg-[#FAC71E] text-[#0a0a0f] font-semibold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[#FAC71E]/10"
      >
        {isPending ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-[#0a0a0f] border-t-transparent rounded-full" />
            <span>Procesando lista...</span>
          </>
        ) : (
          <span>Guardar en mi Álbum 🚀</span>
        )}
      </button>

      {/* Success Toast */}
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
      <div className="flex justify-center items-center py-10 opacity-30 mt-4">
        <span className="text-[10px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
      </div>
    </div>
  );
}
