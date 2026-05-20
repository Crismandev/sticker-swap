type FilterValue = 'all' | 'owned' | 'missing';

export default function FilterPills({
  active,
  onChange,
}: {
  active: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  const pills: { value: FilterValue; label: string }[] = [
    { value: 'all',     label: 'Todos' },
    { value: 'owned',   label: '✓ Tengo' },
    { value: 'missing', label: '✗ Faltan' },
  ];

  return (
    <div className="flex gap-2">
      {pills.map(({ value, label }) => {
        const active_ = active === value;
        return (
          <button
            key={value}
            id={`filter-${value}`}
            onClick={() => onChange(value)}
            className="text-[11px] font-body font-medium px-3 py-1 card-hover-transition"
            style={{
              borderRadius: '99px',
              background: active_ ? '#FAC71E' : 'transparent',
              border: active_
                ? '0.5px solid #FAC71E'
                : '0.5px solid rgba(255,255,255,0.12)',
              color: active_ ? '#0a0a0f' : 'rgba(240,238,232,0.25)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
