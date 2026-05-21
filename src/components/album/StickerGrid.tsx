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
    ? 'linear-gradient(135deg, rgba(200,164,255,0.12) 0%, rgba(100,160,255,0.06) 50%, rgba(200,164,255,0.12) 100%)'
    : isOwned    ? 'rgba(46,213,115,0.07)'
    : isRepeated ? 'rgba(255,203,47,0.07)'
    : 'rgba(255,255,255,0.025)';

  const borderColor = isFoil
    ? (isOwned ? 'rgba(46,213,115,0.45)' : isRepeated ? 'rgba(255,203,47,0.55)' : 'rgba(200,164,255,0.6)')
    : isOwned    ? 'rgba(46,213,115,0.38)'
    : isRepeated ? 'rgba(255,203,47,0.42)'
    : 'rgba(255,255,255,0.08)';

  const codeColor = isFoil
    ? '#C8A4FF'
    : isOwned    ? '#2ED573'
    : isRepeated ? '#FFCB2F'
    : 'rgba(240,238,232,0.32)';

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
      className="relative flex flex-col items-center justify-center gap-1.5 card-hover-transition active:scale-95 text-center px-1"
      style={{
        aspectRatio: '3 / 4',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        background: bg,
        backgroundSize: isFoil ? '200% 200%' : 'auto',
        animation: isFoil && status === 'wanted' ? 'foil-shift 5s ease infinite' : 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Owned check badge */}
      {isOwned && (
        <span
          className="absolute top-[-5px] right-[-5px] flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold animate-bounce-in"
          style={{ background: '#2ED573', color: '#052e16', boxShadow: '0 2px 8px rgba(46,213,115,0.4)' }}
        >✓</span>
      )}

      {/* Repeated + badge */}
      {isRepeated && (
        <span
          className="absolute top-[-5px] right-[-5px] flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold animate-bounce-in"
          style={{ background: '#FFCB2F', color: '#08080e', boxShadow: '0 2px 8px rgba(255,203,47,0.4)' }}
        >+</span>
      )}

      {/* Repeated ×N label */}
      {isRepeated && (
        <span
          className="absolute bottom-1 right-1 text-[8px] font-bold"
          style={{
            color: '#FFCB2F',
            background: 'rgba(255,203,47,0.15)',
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
