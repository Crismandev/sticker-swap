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
    {
      label: 'PEGADAS',
      value: owned,
      color: '#2ED573',
      dimColor: 'rgba(46,213,115,0.09)',
      borderColor: 'rgba(46,213,115,0.20)',
      icon: '✓',
    },
    {
      label: 'REPETIDAS',
      value: repeated,
      color: '#FFCB2F',
      dimColor: 'rgba(255,203,47,0.09)',
      borderColor: 'rgba(255,203,47,0.22)',
      icon: '↻',
    },
    {
      label: 'FALTAN',
      value: missing,
      color: '#FF4757',
      dimColor: 'rgba(255,71,87,0.09)',
      borderColor: 'rgba(255,71,87,0.20)',
      icon: '○',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map(({ label, value, color, dimColor, borderColor, icon }) => (
        <div
          key={label}
          className="flex flex-col items-center py-3 text-center"
          style={{
            background: dimColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '14px',
          }}
        >
          <span className="font-display text-[26px] leading-none" style={{ color }}>
            {value}
          </span>
          <span
            className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.10em] font-body"
            style={{ color: 'rgba(240,238,232,0.40)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
