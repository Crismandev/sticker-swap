export default function ProgressBar({
  owned,
  total,
}: {
  owned: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const fillPct = `${pct}%`;

  return (
    <div className="px-4 py-3">
      {/* Track */}
      <div
        className="relative w-full rounded-pill overflow-visible"
        style={{
          height: '6px',
          background: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-pill"
          style={{
            width: fillPct,
            background: 'linear-gradient(90deg, #FAC71E, #f0a500)',
            transition: 'width 0.5s ease',
          }}
        />
        {/* Glow dot at end of fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{
            left: `calc(${fillPct} - 5px)`,
            background: '#FAC71E',
            boxShadow: '0 0 8px #FAC71E',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-body" style={{ color: 'rgba(240,238,232,0.45)' }}>
          <span style={{ color: '#FAC71E', fontWeight: 500 }}>{owned}</span>
          {' / '}{total} figuritas
        </span>
        <span className="font-display text-[18px]" style={{ color: '#FAC71E' }}>
          {fillPct}
        </span>
      </div>
    </div>
  );
}
