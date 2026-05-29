import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SECTIONS } from '@/lib/sections';

type StickerItem = {
  status: string;
  quantity: number;
  stickers: any;
};

export default async function PublicProfilePage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token: token } = await params;
  const supabase = await createClient();

  // Fetch the user by share_token
  const { data: user } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, city, country')
    .eq('share_token', token)
    .single();

  if (!user) {
    notFound();
  }

  // Fetch their repeated and owned stickers
  const { data: stickersData } = await supabase
    .from('user_stickers')
    .select('status, quantity, stickers(code, name, is_foil, sections(name, flag_emoji))')
    .eq('user_id', user.id)
    .in('status', ['repeated', 'owned']);

  const repeated = (stickersData || []).filter(s => s.status === 'repeated');

  // Group repeated by section
  const repeatedGrouped: Record<string, { flag: string; list: string[] }> = {};
  repeated.forEach(r => {
    const sticker = Array.isArray(r.stickers) ? r.stickers[0] : r.stickers;
    if (!sticker) return;
    const section = Array.isArray(sticker.sections) ? sticker.sections[0] : sticker.sections;
    const sectionName = section?.name || 'Especial';
    const flag = section?.flag_emoji || '🏆';
    if (!repeatedGrouped[sectionName]) {
      repeatedGrouped[sectionName] = { flag, list: [] };
    }
    const suffix = r.quantity > 1 ? ` (x${r.quantity})` : '';
    repeatedGrouped[sectionName].list.push(`${sticker.code}${suffix}`);
  });

  // Find all sticker codes in the album that they do not own
  const ownedSet = new Set(
    (stickersData || [])
      .filter(s => s.status === 'owned' || s.status === 'repeated')
      .map(s => {
        const sticker = Array.isArray(s.stickers) ? s.stickers[0] : s.stickers;
        return sticker?.code?.toUpperCase();
      })
      .filter(Boolean)
  );

  // Group missing (wanted) by section
  const wantedGrouped: Record<string, { flag: string; list: string[] }> = {};
  let wantedCount = 0;

  SECTIONS.forEach(section => {
    const teamName = section.name;
    const flag = section.flag;
    const list: string[] = [];

    for (let i = 1; i <= section.total; i++) {
      const code = `${section.code}${i}`;
      if (!ownedSet.has(code.toUpperCase())) {
        list.push(code);
        wantedCount++;
      }
    }

    if (list.length > 0) {
      wantedGrouped[teamName] = { flag, list };
    }
  });

  const initials = user.display_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f0eee8] pb-16 font-body">
      {/* Premium Header */}
      <header
        className="relative overflow-hidden px-4 pt-12 pb-8 text-center border-b border-[rgba(255,255,255,0.06)]"
        style={{
          background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FAC71E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display text-2xl font-bold border border-[rgba(255,255,255,0.12)] shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #1b1b2f 0%, #0d0d17 100%)',
              color: '#FAC71E',
            }}
          >
            {initials}
          </div>

          <h1 className="font-display text-[30px] leading-tight text-[#f0eee8] mt-4 uppercase">
            {user.display_name}
          </h1>
          <p className="text-[12px] text-[rgba(240,238,232,0.4)] mt-1.5 flex items-center gap-1.5 justify-center">
            <span>@{user.username}</span>
            {user.city && (
              <>
                <span>•</span>
                <span>📍 {user.city}, {user.country}</span>
              </>
            )}
          </p>

          <span
            className="inline-block text-[10px] tracking-widest font-bold px-3 py-1 mt-4"
            style={{
              background: 'rgba(250,199,30,0.08)',
              border: '0.5px solid rgba(250,199,30,0.2)',
              color: '#FAC71E',
              borderRadius: '99px',
            }}
          >
            CROMOS PARA INTERCAMBIAR
          </span>
        </div>
      </header>

      {/* Lists container */}
      <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-2 gap-6 mt-6">
        {/* REPEATED */}
        <section
          className="p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-lg"
          style={{ background: '#111119' }}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[rgba(255,255,255,0.06)] pb-2.5">
            <h2 className="font-display text-[18px] text-[#4ade80] tracking-wide">
              REPETIDAS DISPONIBLES
            </h2>
            <span
              className="text-[11px] font-bold px-2 py-0.5"
              style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '0.5px solid rgba(74, 222, 128, 0.3)',
                color: '#4ade80',
                borderRadius: '8px',
              }}
            >
              {repeated.length}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {Object.entries(repeatedGrouped).map(([team, val]) => (
              <div key={team}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base">{val.flag}</span>
                  <span className="text-[11px] uppercase tracking-wider text-[rgba(240,238,232,0.45)] font-semibold">
                    {team}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {val.list.map(c => (
                    <span
                      key={c}
                      className="font-mono text-[10px] font-bold px-2.5 py-1 rounded"
                      style={{
                        background: 'rgba(74,222,128,0.1)',
                        border: '0.5px solid rgba(74,222,128,0.2)',
                        color: '#4ade80',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {repeated.length === 0 && (
              <div className="text-center py-8 text-xs text-[rgba(240,238,232,0.3)]">
                No tiene repetidas registradas.
              </div>
            )}
          </div>
        </section>

        {/* WANTED */}
        <section
          className="p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] shadow-lg"
          style={{ background: '#111119' }}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[rgba(255,255,255,0.06)] pb-2.5">
            <h2 className="font-display text-[18px] text-[#fb7185] tracking-wide">
              LE FALTAN (LISTA DE DESEOS)
            </h2>
            <span
              className="text-[11px] font-bold px-2 py-0.5"
              style={{
                background: 'rgba(251, 113, 133, 0.1)',
                border: '0.5px solid rgba(251, 113, 133, 0.3)',
                color: '#fb7185',
                borderRadius: '8px',
              }}
            >
              {wantedCount}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {Object.entries(wantedGrouped).map(([team, val]) => (
              <div key={team}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base">{val.flag}</span>
                  <span className="text-[11px] uppercase tracking-wider text-[rgba(240,238,232,0.45)] font-semibold">
                    {team}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {val.list.map(c => (
                    <span
                      key={c}
                      className="font-mono text-[10px] font-bold px-2.5 py-1 rounded"
                      style={{
                        background: 'rgba(251,113,133,0.1)',
                        border: '0.5px solid rgba(251,113,133,0.2)',
                        color: '#fb7185',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {wantedCount === 0 && (
              <div className="text-center py-8 text-xs text-[rgba(240,238,232,0.3)]">
                No tiene cromos pendientes en su lista.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col items-center justify-center mt-10 gap-3 px-4 text-center">
        <p className="text-xs text-[rgba(240,238,232,0.35)]">
          ¿Tú también estás coleccionando cromos de la Copa Mundial 2026?
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#FAC71E] text-[#0a0a0f] font-semibold rounded-xl text-sm transition-all active:scale-[0.98] shadow-lg shadow-[#FAC71E]/10"
        >
          ¡Únete a Sticker-Swap y comienza a cambiar!
        </Link>
      </div>

      {/* Signature */}
      <div className="flex justify-center items-center py-12 opacity-35">
        <span className="text-[10px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
      </div>
    </main>
  );
}
