'use client';

export type StickerStatus = 'wanted' | 'owned' | 'repeated';

type Sticker = {
  id: string;
  code: string;
  name: string;
  is_foil: boolean;
  status?: StickerStatus;
  quantity?: number;
};

const STATUS_CYCLE: StickerStatus[] = ['wanted', 'owned', 'repeated'];

function StickerCard({
  sticker,
  onStatusChange,
  onOpenQuantityModal,
}: {
  sticker: Sticker;
  onStatusChange: (id: string, status: StickerStatus, quantity?: number) => void;
  onOpenQuantityModal: (id: string, name: string, status: StickerStatus, quantity: number) => void;
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
        if (status === 'repeated') {
          onOpenQuantityModal(sticker.id, sticker.name, status, sticker.quantity || 1);
        } else {
          const nextIdx = (STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length;
          onStatusChange(sticker.id, STATUS_CYCLE[nextIdx], 1);
        }
      }}
      className="relative flex flex-col items-center justify-center gap-1.5 card-hover-transition active:scale-95 text-center px-1 shadow-sm"
      style={{
        aspectRatio: '3 / 4',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        background: bg,
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: isFoil ? '0 4px 12px -4px rgba(192,160,255,0.15)' : 'none',
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
          className="absolute bottom-1 right-1 text-[8px] font-bold animate-pulse-light"
          style={{
            color: '#FAC71E',
            background: 'rgba(250,199,30,0.15)',
            padding: '1px 4px',
            borderRadius: '4px',
          }}
        >
          ×{sticker.quantity || 1}
        </span>
      )}

      {/* Icon */}
      <span className="text-[12px] drop-shadow-sm" style={{ color: codeColor }}>{icon}</span>

      {/* Code */}
      <span
        className="font-display text-[12px] font-bold leading-none tracking-wider"
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
  onOpenQuantityModal,
}: {
  stickers: Sticker[];
  onStatusChange: (id: string, status: StickerStatus, quantity?: number) => void;
  onOpenQuantityModal: (id: string, name: string, status: StickerStatus, quantity: number) => void;
}) {
  return (
    <div
      className="grid px-5"
      style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}
    >
      {stickers.map(s => (
        <StickerCard
          key={s.id}
          sticker={s}
          onStatusChange={onStatusChange}
          onOpenQuantityModal={onOpenQuantityModal}
        />
      ))}
    </div>
  );
}
