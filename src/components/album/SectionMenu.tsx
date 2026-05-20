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

type StatusMap = Record<string, StickerStatus>;

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full rounded-pill overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '99px' }} />
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
          ? 'linear-gradient(135deg, rgba(250,199,30,0.12), rgba(250,199,30,0.04))'
          : `linear-gradient(135deg, ${section.color}18, rgba(255,255,255,0.02))`,
        border: isSpecial
          ? '0.5px solid rgba(250,199,30,0.3)'
          : `0.5px solid ${section.color}30`,
        borderRadius: '16px',
        padding: '14px 12px 12px',
      }}
    >
      {/* Color accent strip top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: isSpecial ? '#FAC71E' : section.color, opacity: 0.6 }}
      />

      {/* Flag / icon */}
      <span className="text-3xl mb-2 leading-none">{section.flag}</span>

      {/* Name */}
      <span
        className="font-display text-[15px] leading-tight tracking-wide mb-0.5"
        style={{ color: '#f0eee8' }}
      >
        {section.name.toUpperCase()}
      </span>

      {/* Code */}
      <span
        className="font-body text-[10px] uppercase tracking-wider mb-3"
        style={{ color: 'rgba(240,238,232,0.3)' }}
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
          className="absolute top-2.5 right-2.5 text-[9px] font-bold font-body px-1.5 py-0.5"
          style={{
            background: 'rgba(250,199,30,0.15)',
            border: '0.5px solid rgba(250,199,30,0.3)',
            color: '#FAC71E',
            borderRadius: '6px',
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
      .filter(id => statusMap[id] === 'owned').length;
  const getRepeated = (code: string, total: number) =>
    Array.from({ length: total }, (_, i) => `${code}${i + 1}`)
      .filter(id => statusMap[id] === 'repeated').length;

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
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] uppercase tracking-[0.14em] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
          SELECCIONES — {teams.length} EQUIPOS
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
