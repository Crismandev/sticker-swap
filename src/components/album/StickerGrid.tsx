'use client';

import { useState, useCallback } from 'react';

export type StickerStatus = 'wanted' | 'owned' | 'repeated';

type Sticker = {
  id: string;
  code: string;
  is_foil: boolean;
  status?: StickerStatus;
};

const STATUS_CYCLE: StickerStatus[] = ['wanted', 'owned', 'repeated'];

const TOAST_MESSAGES: Record<StickerStatus, { text: string; color: string }> = {
  owned:    { text: 'Marcada como pegada ✓',    color: '#4ade80' },
  repeated: { text: 'Marcada como repetida ↻',  color: '#FAC71E' },
  wanted:   { text: 'Marcada como faltante ✗',  color: '#fb7185' },
};

function StickerCard({
  sticker,
  onStatusChange,
}: {
  sticker: Sticker;
  onStatusChange: (id: string, status: StickerStatus) => void;
}) {
  const status = sticker.status ?? 'wanted';
  const isOwned    = status === 'owned';
  const isRepeated = status === 'repeated';
  const isFoil     = sticker.is_foil;

  const bg = isFoil && status === 'wanted'
    ? 'linear-gradient(135deg, rgba(192,160,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
    : isOwned    ? 'rgba(74,222,128,0.06)'
    : isRepeated ? 'rgba(250,199,30,0.06)'
    : 'rgba(255,255,255,0.03)';

  const borderColor = isFoil
    ? (isOwned ? 'rgba(74,222,128,0.4)' : isRepeated ? 'rgba(250,199,30,0.5)' : 'rgba(192,160,255,0.5)')
    : isOwned    ? 'rgba(74,222,128,0.35)'
    : isRepeated ? 'rgba(250,199,30,0.4)'
    : 'rgba(255,255,255,0.07)';

  const codeColor = isFoil
    ? 'rgba(192,160,255,0.8)'
    : isOwned    ? 'rgba(74,222,128,0.7)'
    : isRepeated ? 'rgba(250,199,30,0.8)'
    : 'rgba(240,238,232,0.3)';

  const icon = isFoil ? '✦' : isOwned ? '●' : isRepeated ? '●' : '○';

  return (
    <button
      id={`sticker-${sticker.id}`}
      onClick={() => {
        const nextIdx = (STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length;
        onStatusChange(sticker.id, STATUS_CYCLE[nextIdx]);
      }}
      className="relative flex flex-col items-center justify-center gap-1 card-hover-transition active:scale-95"
      style={{
        aspectRatio: '3 / 4',
        borderRadius: '10px',
        border: `0.5px solid ${borderColor}`,
        background: bg,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Owned check badge */}
      {isOwned && (
        <span
          className="absolute top-[-5px] right-[-5px] flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold"
          style={{ background: '#4ade80', color: '#052e16' }}
        >✓</span>
      )}

      {/* Repeated + badge */}
      {isRepeated && (
        <span
          className="absolute top-[-5px] right-[-5px] flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-bold"
          style={{ background: '#FAC71E', color: '#0a0a0f' }}
        >+</span>
      )}

      {/* Repeated ×N label */}
      {isRepeated && (
        <span
          className="absolute bottom-1 right-1 text-[8px] font-bold"
          style={{
            color: '#FAC71E',
            background: 'rgba(250,199,30,0.15)',
            padding: '1px 4px',
            borderRadius: '4px',
          }}
        >×1</span>
      )}

      {/* Icon */}
      <span className="text-[10px]" style={{ color: codeColor }}>{icon}</span>

      {/* Code */}
      <span
        className="font-display text-[11px] leading-none tracking-wide"
        style={{ color: codeColor }}
      >
        {sticker.code}
      </span>
    </button>
  );
}

export default function StickerGrid({
  stickers,
  onStatusChange,
}: {
  stickers: Sticker[];
  onStatusChange: (id: string, status: StickerStatus) => void;
}) {
  return (
    <div
      className="grid px-4"
      style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}
    >
      {stickers.map(s => (
        <StickerCard key={s.id} sticker={s} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
