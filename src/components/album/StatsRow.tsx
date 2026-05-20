export default function StatsRow({
  owned,
  repeated,
  missing,
}: {
  owned: number;
  repeated: number;
  missing: number;
}) {
  const stats = [
    { label: 'PEGADAS',  value: owned,    color: '#FAC71E' },
    { label: 'REPETIDAS', value: repeated, color: '#4ade80' },
    { label: 'FALTAN',   value: missing,  color: '#fb7185' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-4 pb-3">
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center py-2.5 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
          }}
        >
          <span className="font-display text-[22px] leading-none" style={{ color }}>
            {value}
          </span>
          <span
            className="mt-1 text-[10px] uppercase tracking-[0.06em] font-body"
            style={{ color: 'rgba(240,238,232,0.25)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
