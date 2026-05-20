'use client';

type Team = {
  code: string;
  name: string;
  flag: string;
  color: string;
  owned: number;
  total: number;
};

export default function TeamSelector({
  teams,
  activeCode,
  onSelect,
}: {
  teams: Team[];
  activeCode: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div
      className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {teams.map(({ code, flag, owned, total }) => {
        const active = code === activeCode;
        return (
          <button
            key={code}
            id={`team-chip-${code.toLowerCase()}`}
            onClick={() => onSelect(code)}
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-body font-medium card-hover-transition"
            style={{
              padding: '6px 12px 6px 8px',
              borderRadius: '99px',
              background: active ? 'rgba(250,199,30,0.12)' : 'rgba(255,255,255,0.04)',
              border: active
                ? '0.5px solid rgba(250,199,30,0.5)'
                : '0.5px solid rgba(255,255,255,0.08)',
              color: active ? '#FAC71E' : 'rgba(240,238,232,0.45)',
            }}
          >
            <span>{flag}</span>
            <span className="uppercase tracking-wide text-[12px]">{code}</span>
            <span className="text-[11px] opacity-70">{owned}/{total}</span>
          </button>
        );
      })}
    </div>
  );
}
