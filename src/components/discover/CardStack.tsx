'use client';

import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import MatchCard, { type MatchProfile } from './MatchCard';
import MatchModal from './MatchModal';

export type CardStackHandle = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

const STACK_TRANSFORMS = [
  { scale: 1,    y: 0,  opacity: 1,    z: 3 },
  { scale: 0.94, y: 16, opacity: 0.50, z: 2 },
  { scale: 0.88, y: 32, opacity: 0.24, z: 1 },
];

const CardStack = forwardRef<CardStackHandle, {
  profiles: MatchProfile[];
  onAccept: (profile: MatchProfile) => void;
  onReject: (profile: MatchProfile) => void;
}>(function CardStack({ profiles, onAccept, onReject }, ref) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [matchedProfile, setMatched] = useState<MatchProfile | null>(null);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [dragX, setDragX] = useState(0);

  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const isSwiping = useRef(false);

  const remaining = profiles.filter(p => !dismissed.includes(p.userId));
  const top = remaining[0];

  const dismiss = useCallback((dir: 'left' | 'right') => {
    if (!top || isSwiping.current) return;
    isSwiping.current = true;
    setSwipeDir(dir);
    setDragX(0);

    setTimeout(() => {
      setSwipeDir(null);
      isSwiping.current = false;
      setDismissed(prev => [...prev, top.userId]);

      if (dir === 'right') {
        onAccept(top);
        if (top.perfect || top.score >= 4) setMatched(top);
      } else {
        onReject(top);
      }
    }, 340);
  }, [top, onAccept, onReject]);

  // Expose swipe methods to parent (for action buttons)
  useImperativeHandle(ref, () => ({
    swipeLeft: () => dismiss('left'),
    swipeRight: () => dismiss('right'),
  }), [dismiss]);

  /* ── Pointer handlers ── */
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSwiping.current) return;
    dragStartX.current = e.clientX;
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isSwiping.current) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 72) {
      dismiss(delta > 0 ? 'right' : 'left');
    } else {
      setDragX(0);
    }
  };

  /* ── Match modal ── */
  if (matchedProfile) {
    return (
      <div className="animate-modal-in mx-4">
        <MatchModal
          profile={{
            name: matchedProfile.name,
            give: matchedProfile.giveCodes,
            get: matchedProfile.getCodes
          }}
          onChat={() => setMatched(null)}
          onSkip={() => { setMatched(null); }}
        />
      </div>
    );
  }

  /* ── Empty state ── */
  if (remaining.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 mx-4"
        style={{
          height: 'min(520px, 65vh)',
          background: 'linear-gradient(180deg, rgba(255,203,47,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 22,
        }}
      >
        <div className="animate-float text-[56px] leading-none" style={{ filter: 'drop-shadow(0 0 16px rgba(255,203,47,0.3))' }}>🎴</div>
        <p className="font-display text-[24px]" style={{ color: 'rgba(240,238,232,0.20)' }}>
          SIN CANDIDATOS
        </p>
        <p className="text-[13px] text-center px-10 leading-relaxed font-body" style={{ color: 'rgba(240,238,232,0.32)' }}>
          Marca más figuritas como{' '}
          <span style={{ color: '#FFCB2F', fontWeight: 600 }}>repetidas</span>{' '}
          para encontrar con quién intercambiar
        </p>
      </div>
    );
  }

  /* ── Visual drag state ── */
  const activeRotation = isSwiping.current ? 0 : (dragX / 380) * 14;
  const tintAccept = !isSwiping.current && dragX > 50 ? Math.min((dragX - 50) / 90, 1) : 0;
  const tintReject = !isSwiping.current && dragX < -50 ? Math.min((-dragX - 50) / 90, 1) : 0;

  const topStyle: React.CSSProperties = {
    transform: swipeDir === 'right'
      ? 'translateX(150%) rotate(20deg)'
      : swipeDir === 'left'
        ? 'translateX(-150%) rotate(-20deg)'
        : `translateX(${dragX}px) rotate(${activeRotation}deg)`,
    opacity: swipeDir ? 0 : 1,
    transition: swipeDir ? 'transform 0.34s ease, opacity 0.2s ease' : 'none',
    zIndex: 3,
    cursor: isDragging.current ? 'grabbing' : 'grab',
  };

  return (
    <div className="relative mx-4" style={{ height: 'min(520px, 65vh)', userSelect: 'none', touchAction: 'none' }}>
      {/* Back cards */}
      {remaining.slice(1, 3).map((profile, i) => {
        const t = STACK_TRANSFORMS[i + 1] ?? STACK_TRANSFORMS[2];
        return (
          <div
            key={profile.userId}
            className="absolute inset-0 transition-card pointer-events-none"
            style={{ transform: `scale(${t.scale}) translateY(${t.y}px)`, opacity: t.opacity, zIndex: t.z }}
          >
            <MatchCard profile={profile} />
          </div>
        );
      })}

      {/* Top card */}
      <div
        className="absolute inset-0"
        style={topStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { isDragging.current = false; setDragX(0); }}
      >
        <MatchCard profile={top} />

        {/* Swipe overlays */}
        {tintAccept > 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[22px] pointer-events-none"
            style={{
              background: `rgba(46,213,115,${tintAccept * 0.22})`,
              border: `2px solid rgba(46,213,115,${tintAccept * 0.9})`,
            }}
          >
            <span
              className="font-display text-[48px]"
              style={{ color: `rgba(46,213,115,${tintAccept})`, transform: 'rotate(-18deg)', textShadow: '0 0 28px rgba(46,213,115,0.5)' }}
            >
              SÍ ✓
            </span>
          </div>
        )}
        {tintReject > 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-[22px] pointer-events-none"
            style={{
              background: `rgba(255,71,87,${tintReject * 0.22})`,
              border: `2px solid rgba(255,71,87,${tintReject * 0.9})`,
            }}
          >
            <span
              className="font-display text-[48px]"
              style={{ color: `rgba(255,71,87,${tintReject})`, transform: 'rotate(18deg)', textShadow: '0 0 28px rgba(255,71,87,0.5)' }}
            >
              NO ✕
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default CardStack;
