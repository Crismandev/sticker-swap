'use client';

import { type StickerStatus } from '@/components/album/StickerGrid';

type Section = {
  code: string;
  name: string;
  flag: string;
  color: string;
  total: number;
  type?: 'team' | 'special';
};

type StatusMap = Record<string, StickerStatus | { status: StickerStatus; quantity?: number }>;

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '99px', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </div>
  );
}

function SectionThumbnail({
  section,
  ownedCount,
  repeatedCount,
  onClick,
}: {
  section: Section;
  ownedCount: number;
  repeatedCount: number;
  onClick: () => void;
}) {
  const pct = section.total > 0 ? Math.round((ownedCount / section.total) * 100) : 0;
  const isSpecial = section.type === 'special';
  const barColor = isSpecial ? '#FAC71E' : (pct > 70 ? '#4ade80' : pct > 30 ? '#FAC71E' : '#fb7185');

  return (
    <button
      id={`section-thumb-${section.code.toLowerCase()}`}
      onClick={onClick}
      className="flex flex-col text-left card-hover-transition active:scale-95 relative overflow-hidden"
      style={{
        background: isSpecial
          ? 'linear-gradient(135deg, rgba(250,199,30,0.15), rgba(250,199,30,0.03))'
          : `linear-gradient(135deg, ${section.color}15, rgba(255,255,255,0.02))`,
        border: isSpecial
          ? '1px solid rgba(250,199,30,0.3)'
          : `1px solid ${section.color}30`,
        borderRadius: '20px',
        padding: '16px 14px',
        boxShadow: `0 8px 24px -8px ${section.color}15`,
      }}
    >
      {/* Color accent strip top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: isSpecial ? '#FAC71E' : section.color, opacity: 0.8 }}
      />

      {/* Flag / icon */}
      <span className="text-[32px] mb-2.5 leading-none drop-shadow-sm">{section.flag}</span>

      {/* Name */}
      <span
        className="font-display text-[15px] font-medium leading-tight tracking-wide mb-1"
        style={{ color: '#f0eee8' }}
      >
        {section.name.toUpperCase()}
      </span>

      {/* Code */}
      <span
        className="font-body text-[10px] font-bold uppercase tracking-[0.15em] mb-4"
        style={{ color: 'rgba(240,238,232,0.45)' }}
      >
        {section.code}
      </span>

      {/* Mini progress bar */}
      <MiniBar pct={pct} color={barColor} />

      {/* Stats */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] font-body" style={{ color: 'rgba(240,238,232,0.35)' }}>
          {ownedCount}/{section.total}
        </span>
        <span className="text-[10px] font-body font-medium" style={{ color: barColor }}>
          {pct}%
        </span>
      </div>

      {/* Repeated badge */}
      {repeatedCount > 0 && (
        <div
          className="absolute top-3 right-3 text-[10px] font-bold font-body px-2 py-0.5 shadow-sm"
          style={{
            background: 'rgba(250,199,30,0.15)',
            border: '1px solid rgba(250,199,30,0.35)',
            color: '#FAC71E',
            borderRadius: '8px',
          }}
        >
          ×{repeatedCount}
        </div>
      )}
    </button>
  );
}

export default function SectionMenu({
  sections,
  statusMap,
  onSelect,
}: {
  sections: Section[];
  statusMap: StatusMap;
  onSelect: (code: string) => void;
}) {
  const special = sections.filter(s => s.type === 'special');
  const teams   = sections.filter(s => s.type !== 'special');

  const getOwned    = (code: string, total: number) =>
    Array.from({ length: total }, (_, i) => `${code}${i + 1}`)
      .filter(id => {
        const entry = statusMap[id] as any;
        if (!entry) return false;
        const status = typeof entry === 'string' ? entry : entry.status;
        return status === 'owned' || status === 'repeated';
      }).length;

  const getRepeated = (code: string, total: number) =>
    Array.from({ length: total }, (_, i) => `${code}${i + 1}`)
      .reduce((acc, id) => {
        const entry = statusMap[id] as any;
        if (!entry) return acc;
        const status = typeof entry === 'string' ? entry : entry.status;
        const quantity = typeof entry === 'string' ? 1 : (entry.quantity ?? 1);
        return acc + (status === 'repeated' ? quantity : 0);
      }, 0);

  return (
    <div className="px-4 pb-4">
      {/* Special section */}
      {special.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-[0.14em] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
              SECCIÓN ESPECIAL
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {special.map(s => (
              <SectionThumbnail
                key={s.code}
                section={s}
                ownedCount={getOwned(s.code, s.total)}
                repeatedCount={getRepeated(s.code, s.total)}
                onClick={() => onSelect(s.code)}
              />
            ))}
          </div>
        </>
      )}

      {/* Team sections */}
      <div className="flex items-center gap-2 mb-4 mt-6">
        <span className="text-[11px] uppercase tracking-[0.16em] font-bold font-body" style={{ color: 'rgba(240,238,232,0.35)' }}>
          SELECCIONES — {teams.length} EQUIPOS
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {teams.map(s => (
          <SectionThumbnail
            key={s.code}
            section={s}
            ownedCount={getOwned(s.code, s.total)}
            repeatedCount={getRepeated(s.code, s.total)}
            onClick={() => onSelect(s.code)}
          />
        ))}
      </div>
    </div>
  );
}
