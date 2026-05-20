export default function MatchModal({
  profile,
  onChat,
  onSkip,
}: {
  profile: { name: string; give: string[]; get: string[] };
  onChat: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      className="flex items-center mx-4 animate-match-modal"
      style={{
        minHeight: '340px',
        background: 'rgba(0,0,0,0.75)',
        borderRadius: '20px',
      }}
    >
      <div
        className="w-full text-center"
        style={{
          background: '#12121a',
          border: '0.5px solid rgba(74,222,128,0.3)',
          borderRadius: '20px',
          padding: '28px 24px',
        }}
      >
        <div className="text-4xl mb-2">⚡</div>
        <p className="font-display text-[30px] leading-none mb-2" style={{ color: '#4ade80' }}>
          ¡ES UN MATCH!
        </p>
        <p className="text-[13px] mb-4 font-body" style={{ color: 'rgba(240,238,232,0.45)' }}>
          Tú y <strong style={{ color: '#f0eee8' }}>{profile.name}</strong> pueden intercambiar{' '}
          <span style={{ color: '#FAC71E' }}>{profile.give.length + profile.get.length}</span> figuritas
        </p>

        {/* Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {profile.give.slice(0, 3).map(c => (
            <span
              key={c}
              className="text-[10px] font-bold uppercase font-body"
              style={{
                background: 'rgba(74,222,128,0.1)',
                border: '0.5px solid rgba(74,222,128,0.2)',
                color: '#4ade80',
                padding: '3px 7px',
                borderRadius: '6px',
              }}
            >{c}</span>
          ))}
          {profile.get.slice(0, 3).map(c => (
            <span
              key={c}
              className="text-[10px] font-bold uppercase font-body"
              style={{
                background: 'rgba(250,199,30,0.1)',
                border: '0.5px solid rgba(250,199,30,0.2)',
                color: '#FAC71E',
                padding: '3px 7px',
                borderRadius: '6px',
              }}
            >{c}</span>
          ))}
        </div>

        <button
          id="match-chat-btn"
          onClick={onChat}
          className="w-full py-3 font-body font-medium text-sm mb-2"
          style={{
            background: '#4ade80',
            color: '#052e16',
            borderRadius: '12px',
          }}
        >
          Iniciar intercambio
        </button>
        <button
          id="match-skip-btn"
          onClick={onSkip}
          className="w-full py-2 text-sm font-body"
          style={{
            background: 'transparent',
            border: '0.5px solid rgba(255,255,255,0.08)',
            color: 'rgba(240,238,232,0.25)',
            borderRadius: '12px',
          }}
        >
          Ver más matches
        </button>
      </div>
    </div>
  );
}
