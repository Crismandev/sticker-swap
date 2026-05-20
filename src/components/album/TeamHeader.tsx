export default function TeamHeader({
  name,
  flag,
  owned,
  repeated,
  missing,
  total,
}: {
  name: string;
  flag: string;
  owned: number;
  repeated: number;
  missing: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-3 mx-4 mb-3"
      style={{
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
      }}
    >
      {/* Flag */}
      <span className="text-3xl flex-shrink-0">{flag}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[20px] leading-none tracking-[0.06em]" style={{ color: '#f0eee8' }}>
          {name.toUpperCase()}
        </p>
        <p className="mt-0.5 text-[11px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
          {owned} pegadas · {repeated} repetidas · {missing} faltan
        </p>
      </div>

      {/* Mini bar */}
      <div className="flex-shrink-0 w-16 flex flex-col items-end gap-1">
        <span className="text-[10px] font-body" style={{ color: '#FAC71E' }}>{pct}%</span>
        <div
          className="w-full rounded-pill overflow-hidden"
          style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}
        >
          <div
            className="h-full rounded-pill"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #FAC71E, #f0a500)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
