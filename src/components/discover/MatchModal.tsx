'use client';

import { useEffect, useState } from 'react';

// Simple CSS confetti piece
function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#FFCB2F', '#2ED573', '#FF4757', '#C8A4FF', '#74b9ff', '#fd79a8'];
  const color = colors[index % colors.length];
  const left = `${(index * 7.3 + 5) % 95}%`;
  const delay = `${(index * 0.08) % 0.8}s`;
  const duration = `${0.8 + (index % 5) * 0.15}s`;
  const size = index % 3 === 0 ? 8 : index % 3 === 1 ? 6 : 10;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: '-12px',
        width: size,
        height: size,
        background: color,
        borderRadius: index % 2 === 0 ? '50%' : '2px',
        animation: `confetti-fall ${duration} ease-in ${delay} forwards`,
        zIndex: 60,
      }}
    />
  );
}

export default function MatchModal({
  profile,
  onChat,
  onSkip,
}: {
  profile: { name: string; give: string[]; get: string[] };
  onChat: () => void;
  onSkip: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const totalCount = profile.give.length + profile.get.length;

  return (
    <div
      className="relative flex items-center mx-4 animate-modal-in overflow-hidden"
      style={{ minHeight: '380px' }}
    >
      {/* Confetti rain */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <div
        className="w-full text-center relative"
        style={{
          background: 'linear-gradient(180deg, #141424 0%, #0f0f1c 100%)',
          border: '1px solid rgba(46,213,115,0.35)',
          borderRadius: '22px',
          padding: '32px 24px 24px',
          boxShadow: '0 0 60px rgba(46,213,115,0.12), 0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #2ED573, #FFCB2F, #2ED573)',
            borderRadius: '22px 22px 0 0',
          }}
        />

        {/* Match icon */}
        <div className="animate-bounce-in text-[52px] mb-3 leading-none">⚡</div>

        {/* Title */}
        <p
          className="font-display text-[36px] leading-none mb-2"
          style={{ color: '#2ED573', textShadow: '0 0 30px rgba(46,213,115,0.4)' }}
        >
          ¡ES UN MATCH!
        </p>

        {/* Subtitle */}
        <p className="text-[13px] mb-5 font-body leading-relaxed" style={{ color: 'rgba(240,238,232,0.5)' }}>
          Tú y{' '}
          <strong style={{ color: '#f0eee8', fontWeight: 700 }}>{profile.name}</strong>{' '}
          pueden intercambiar{' '}
          <span style={{ color: '#FFCB2F', fontWeight: 700 }}>{totalCount}</span> figuritas
        </p>

        {/* Two-column chip preview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className="p-3 rounded-[14px] flex flex-col gap-2"
            style={{ background: 'rgba(46,213,115,0.07)', border: '1px solid rgba(46,213,115,0.18)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider font-body mb-1" style={{ color: '#2ED573' }}>
              ↓ Te dan
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.get.slice(0, 4).map(c => (
                <span
                  key={c}
                  className="text-[10px] font-bold font-body"
                  style={{
                    background: 'rgba(46,213,115,0.15)',
                    border: '1px solid rgba(46,213,115,0.25)',
                    color: '#2ED573',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >{c}</span>
              ))}
              {profile.get.length > 4 && (
                <span className="text-[10px] font-body" style={{ color: 'rgba(46,213,115,0.5)' }}>+{profile.get.length - 4}</span>
              )}
            </div>
          </div>

          <div
            className="p-3 rounded-[14px] flex flex-col gap-2"
            style={{ background: 'rgba(255,203,47,0.07)', border: '1px solid rgba(255,203,47,0.18)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider font-body mb-1" style={{ color: '#FFCB2F' }}>
              ↑ Tú das
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.give.slice(0, 4).map(c => (
                <span
                  key={c}
                  className="text-[10px] font-bold font-body"
                  style={{
                    background: 'rgba(255,203,47,0.15)',
                    border: '1px solid rgba(255,203,47,0.25)',
                    color: '#FFCB2F',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >{c}</span>
              ))}
              {profile.give.length > 4 && (
                <span className="text-[10px] font-body" style={{ color: 'rgba(255,203,47,0.5)' }}>+{profile.give.length - 4}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <button
          id="match-chat-btn"
          onClick={onChat}
          className="w-full py-3.5 font-body font-bold text-[15px] mb-2.5 transition-all active:scale-[0.97]"
          style={{
            background: '#2ED573',
            color: '#052e16',
            borderRadius: '14px',
            boxShadow: '0 4px 20px rgba(46,213,115,0.35)',
          }}
        >
          🤝 Iniciar intercambio
        </button>
        <button
          id="match-skip-btn"
          onClick={onSkip}
          className="w-full py-2.5 text-[13px] font-body font-medium transition-all active:scale-[0.97]"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(240,238,232,0.35)',
            borderRadius: '14px',
          }}
        >
          Ver más matches →
        </button>
      </div>
    </div>
  );
}
