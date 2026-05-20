'use client';

import { useState, useRef } from 'react';
import MatchCard, { type MatchProfile } from './MatchCard';
import MatchModal from './MatchModal';
import ActionButtons from './ActionButtons';

export default function CardStack({
  profiles,
}: {
  profiles: MatchProfile[];
}) {
  const [cards, setCards]       = useState(profiles);
  const [matchProfile, setMatch] = useState<MatchProfile | null>(null);
  const [swipeDir, setSwipeDir]  = useState<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  const cardRef    = useRef<HTMLDivElement>(null);

  const dismiss = (dir: 'left' | 'right') => {
    if (cards.length === 0) return;
    const top = cards[0];

    if (dir === 'right' && top.perfect) {
      setMatch(top);
      return;
    }

    setSwipeDir(dir);
    setTimeout(() => {
      setSwipeDir(null);
      setCards(prev => prev.slice(1));
    }, 380);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 70) dismiss(delta > 0 ? 'right' : 'left');
  };

  if (matchProfile) {
    return (
      <MatchModal
        profile={matchProfile}
        onChat={() => setMatch(null)}
        onSkip={() => {
          setMatch(null);
          setCards(prev => prev.slice(1));
        }}
      />
    );
  }

  if (cards.length === 0) {
    return (
      <div
        className="flex items-center justify-center mx-4"
        style={{
          height: 420,
          background: 'rgba(255,255,255,0.02)',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
        }}
      >
        <div className="text-center">
          <p className="font-display text-[28px]" style={{ color: '#FAC71E' }}>SIN MATCHES</p>
          <p className="text-sm mt-1 font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
            Vuelve más tarde o marca más figuritas
          </p>
        </div>
      </div>
    );
  }

  const transforms = [
    'scale(1) translateY(0px)',
    'scale(0.95) translateY(12px)',
    'scale(0.90) translateY(24px)',
  ];
  const opacities = [1, 0.5, 0.25];

  const swipeTransform =
    swipeDir === 'right'
      ? 'translateX(140%) rotate(18deg)'
      : swipeDir === 'left'
      ? 'translateX(-140%) rotate(-18deg)'
      : undefined;

  return (
    <div
      className="relative mx-4"
      style={{ height: 420 }}
    >
      {cards.slice(0, 3).map((profile, idx) => {
        const isTop = idx === 0;
        return (
          <div
            key={profile.name + idx}
            ref={isTop ? cardRef : undefined}
            className="absolute inset-0 card-transition"
            style={{
              transform: isTop && swipeTransform ? swipeTransform : transforms[idx],
              opacity: isTop && swipeDir ? 0 : opacities[idx],
              zIndex: 3 - idx,
              pointerEvents: isTop ? 'auto' : 'none',
            }}
            onPointerDown={isTop ? handlePointerDown : undefined}
            onPointerUp={isTop ? handlePointerUp : undefined}
          >
            <MatchCard profile={profile} />
          </div>
        );
      })}
    </div>
  );
}
