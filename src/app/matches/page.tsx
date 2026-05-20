export default function MatchesPage() {
  const MOCK_MATCHES = [
    { name: 'Carlos M.', initials: 'CM', city: 'Lima',            give: 5, get: 4, colorIndex: 0 },
    { name: 'Sofía R.',  initials: 'SR', city: 'Bogotá',          give: 3, get: 6, colorIndex: 1 },
    { name: 'Diego V.',  initials: 'DV', city: 'Ciudad de México', give: 7, get: 2, colorIndex: 2 },
  ];

  return (
    <div className="min-h-screen pb-4">
      <div className="px-4 pt-6 pb-3">
        <span className="block text-[10px] uppercase tracking-[0.18em] font-body" style={{ color: '#FAC71E' }}>
          MIS MATCHES
        </span>
        <span className="font-display text-[26px] leading-none" style={{ color: '#f0eee8' }}>
          INTERCAMBIOS ACTIVOS
        </span>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {MOCK_MATCHES.map((m, i) => (
          <button
            key={i}
            id={`match-item-${i}`}
            className="w-full flex items-center gap-3 text-left card-hover-transition"
            style={{
              background: '#12121a',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '14px 16px',
            }}
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display text-lg"
              style={{
                background: ['linear-gradient(135deg,#3b82f6,#1d4ed8)', 'linear-gradient(135deg,#a855f7,#7e22ce)', 'linear-gradient(135deg,#4ade80,#15803d)'][m.colorIndex],
                color: '#0a0a0f',
              }}
            >
              {m.initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display text-[18px] leading-none" style={{ color: '#f0eee8' }}>
                {m.name.toUpperCase()}
              </p>
              <p className="mt-0.5 text-[11px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
                📍 {m.city}
              </p>
            </div>

            <div className="flex-shrink-0 flex gap-3 text-center">
              <div>
                <p className="font-display text-[16px] leading-none" style={{ color: '#4ade80' }}>{m.give}</p>
                <p className="text-[9px] font-body uppercase" style={{ color: 'rgba(240,238,232,0.25)' }}>DAS</p>
              </div>
              <div>
                <p className="font-display text-[16px] leading-none" style={{ color: '#FAC71E' }}>{m.get}</p>
                <p className="text-[9px] font-body uppercase" style={{ color: 'rgba(240,238,232,0.25)' }}>RECIBES</p>
              </div>
            </div>
          </button>
        ))}

        {MOCK_MATCHES.length === 0 && (
          <div className="text-center mt-20">
            <p className="font-display text-[24px]" style={{ color: 'rgba(240,238,232,0.15)' }}>
              SIN MATCHES AÚN
            </p>
            <p className="text-sm mt-2 font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
              Ve a Descubrir para encontrar personas con quién intercambiar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
