'use client';

import Avatar from '@/components/ui/Avatar';
import CodeChip from '@/components/ui/CodeChip';
import ProgressBar from '@/components/album/ProgressBar';
import StatsRow from '@/components/album/StatsRow';

const MOCK_USER = {
  name: 'Carlos Mendoza',
  initials: 'CM',
  city: 'Lima',
  country: 'PE',
  owned: 340,
  repeated: 48,
  missing: 592,
  total: 980,
};

const REPEATED_BY_TEAM: { team: string; flag: string; codes: string[] }[] = [
  { team: 'Argentina', flag: '🇦🇷', codes: ['ARG3', 'ARG7', 'ARG17'] },
  { team: 'Brasil',    flag: '🇧🇷', codes: ['BRA9', 'BRA14'] },
  { team: 'Francia',   flag: '🇫🇷', codes: ['FRA5', 'FRA20'] },
];

const MISSING_BY_TEAM: { team: string; flag: string; codes: string[] }[] = [
  { team: 'España',    flag: '🇪🇸', codes: ['ESP15', 'ESP7'] },
  { team: 'Alemania',  flag: '🇩🇪', codes: ['GER11', 'GER4'] },
  { team: 'Colombia',  flag: '🇨🇴', codes: ['COL14'] },
];

function SectionGroup({
  team, flag, codes, variant,
}: {
  team: string; flag: string; codes: string[]; variant: 'give' | 'get';
}) {
  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 mb-2 px-3 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
        }}
      >
        <span>{flag}</span>
        <span className="flex-1 text-[12px] font-body font-medium" style={{ color: '#f0eee8' }}>{team}</span>
        <span className="text-[11px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>{codes.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 px-1">
        {codes.map(c => <CodeChip key={c} code={c} variant={variant} />)}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero */}
      <div
        className="px-4 pb-4 pt-8"
        style={{
          background: '#12121a',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex flex-col items-center mb-4">
          <Avatar initials={MOCK_USER.initials} size={64} colorIndex={0} />
          <h1 className="font-display text-[28px] leading-none mt-3" style={{ color: '#f0eee8' }}>
            {MOCK_USER.name.toUpperCase()}
          </h1>
          <p className="text-[12px] mt-1 font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
            📍 {MOCK_USER.city}, {MOCK_USER.country}
          </p>
        </div>

        <ProgressBar owned={MOCK_USER.owned} total={MOCK_USER.total} />

        <StatsRow
          owned={MOCK_USER.owned}
          repeated={MOCK_USER.repeated}
          missing={MOCK_USER.missing}
        />

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <button
            id="profile-share-btn"
            className="flex-1 py-2.5 text-sm font-body font-medium card-hover-transition"
            style={{
              border: '0.5px solid rgba(250,199,30,0.4)',
              color: '#FAC71E',
              borderRadius: '12px',
              background: 'transparent',
            }}
          >
            ↗ Compartir perfil
          </button>
          <button
            id="profile-swap-btn"
            className="flex-1 py-2.5 text-sm font-body font-medium card-hover-transition"
            style={{
              background: '#FAC71E',
              color: '#0a0a0f',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Intercambiar
          </button>
        </div>
      </div>

      {/* Repeated section */}
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-[20px] leading-none" style={{ color: '#f0eee8' }}>
            DISPONIBLES PARA INTERCAMBIO
          </h2>
          <span
            className="text-[11px] font-body font-medium px-2 py-0.5"
            style={{
              background: 'rgba(250,199,30,0.1)',
              border: '0.5px solid rgba(250,199,30,0.25)',
              color: '#FAC71E',
              borderRadius: '10px',
            }}
          >
            {REPEATED_BY_TEAM.reduce((s, g) => s + g.codes.length, 0)}
          </span>
        </div>

        {REPEATED_BY_TEAM.map(g => (
          <SectionGroup key={g.team} {...g} variant="give" />
        ))}
      </div>

      {/* Missing section */}
      <div className="px-4 pt-3 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-[20px] leading-none" style={{ color: '#f0eee8' }}>
            ME FALTAN
          </h2>
          <span
            className="text-[11px] font-body font-medium px-2 py-0.5"
            style={{
              background: 'rgba(251,113,133,0.1)',
              border: '0.5px solid rgba(251,113,133,0.25)',
              color: '#fb7185',
              borderRadius: '10px',
            }}
          >
            {MISSING_BY_TEAM.reduce((s, g) => s + g.codes.length, 0)}
          </span>
        </div>

        {MISSING_BY_TEAM.map(g => (
          <SectionGroup key={g.team} {...g} variant="get" />
        ))}
      </div>
    </div>
  );
}
