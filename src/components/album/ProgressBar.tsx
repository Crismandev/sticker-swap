export default function ProgressBar({
  owned,
  total,
}: {
  owned: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const fillPct = `${pct}%`;

  // Dynamic color based on completion — red → amber → green
  const barColor =
    pct >= 70 ? '#2ED573' :
    pct >= 35 ? '#FFCB2F' :
    '#FF4757';

  const barGlow =
    pct >= 70 ? 'rgba(46,213,115,0.40)' :
    pct >= 35 ? 'rgba(255,203,47,0.40)' :
    'rgba(255,71,87,0.35)';

  return (
    <div>
      {/* Track */}
      <div
        className="relative w-full"
        style={{
          height: '8px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '99px',
          overflow: 'visible',
        }}
      >
        {/* Fill with dynamic gradient */}
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: fillPct,
            background: `linear-gradient(90deg, ${barColor}bb, ${barColor})`,
            borderRadius: '99px',
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: `0 0 12px ${barGlow}`,
          }}
        />
        {/* Glow dot at end of fill */}
        {pct > 2 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              left: `calc(${fillPct} - 6px)`,
              background: barColor,
              boxShadow: `0 0 10px ${barColor}, 0 0 20px ${barGlow}`,
              transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[12px] font-body" style={{ color: 'rgba(240,238,232,0.45)' }}>
          <span style={{ color: barColor, fontWeight: 600 }}>{owned}</span>
          {' / '}{total} figuritas
        </span>
        <span className="font-display text-[20px] leading-none" style={{ color: barColor }}>
          {fillPct}
        </span>
      </div>
    </div>
  );
}
