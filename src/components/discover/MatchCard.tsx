import CodeChip from '@/components/ui/CodeChip';
import PerfectBadge from '@/components/ui/PerfectBadge';
import Avatar from '@/components/ui/Avatar';

export type MatchProfile = {
  userId: string;
  name: string;
  initials: string;
  city: string;
  completion: number;
  canGive: number;      // stickers they can give me
  canReceive: number;   // stickers I can give them
  score: number;
  perfect: boolean;
  giveCodes: string[];  // sample codes they give
  getCodes: string[];   // sample codes I give
  colorIndex?: number;
};

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
    </div>
  );
}

const MAX_CHIPS = 4;

export default function MatchCard({ profile, style }: { profile: MatchProfile; style?: React.CSSProperties }) {
  const giveVisible = profile.giveCodes.slice(0, MAX_CHIPS);
  const giveExtra   = profile.giveCodes.length - MAX_CHIPS;
  const getVisible  = profile.getCodes.slice(0, MAX_CHIPS);
  const getExtra    = profile.getCodes.length - MAX_CHIPS;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{
        background: '#111119',
        border: '0.5px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        ...style,
      }}
    >
      {/* ── HEADER ───────────────────────────────── */}
      <div
        className="flex items-center gap-3.5 p-5"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
      >
        <Avatar initials={profile.initials} size={52} colorIndex={profile.colorIndex ?? 0} />

        <div className="flex-1 min-w-0">
          <p className="font-display text-[22px] leading-none" style={{ color: '#f0eee8' }}>
            {profile.name.toUpperCase()}
          </p>
          <p className="mt-1 text-[12px]" style={{ color: 'rgba(240,238,232,0.3)' }}>
            {profile.city ? `📍 ${profile.city} · ` : ''}{profile.completion}% completado
          </p>
        </div>

        {/* Score bubble */}
        <div
          className="flex-shrink-0 flex flex-col items-center px-3 py-2"
          style={{
            background: 'rgba(250,199,30,0.1)',
            border: '0.5px solid rgba(250,199,30,0.25)',
            borderRadius: 12,
            minWidth: 56,
          }}
        >
          <span className="font-display text-[26px] leading-none" style={{ color: '#FAC71E' }}>{profile.score}</span>
          <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(250,199,30,0.6)' }}>figuritas</span>
        </div>
      </div>

      {/* ── EXCHANGE ─────────────────────────────── */}
      <div className="px-5 py-4 flex-1">
        <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'rgba(240,238,232,0.28)' }}>
          PROPUESTA DE INTERCAMBIO
        </p>

        <div className="flex items-start gap-2">
          {/* Gives you */}
          <div className="flex-1">
            <p className="text-[10px] mb-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span>↓</span> Te da
            </p>
            <div className="flex flex-wrap gap-1">
              {getVisible.map(c => <CodeChip key={c} code={c} variant="give" />)}
              {getExtra > 0 && <CodeChip code={`+${getExtra}`} variant="neutral" />}
              {getVisible.length === 0 && (
                <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.25)' }}>—</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 pt-4 text-[13px]" style={{ flexShrink: 0 }}>
            <span style={{ color: '#4ade80' }}>↓</span>
            <span style={{ color: '#FAC71E' }}>↑</span>
          </div>

          {/* You give */}
          <div className="flex-1">
            <p className="text-[10px] mb-2 flex items-center gap-1" style={{ color: '#FAC71E' }}>
              <span>↑</span> Tú das
            </p>
            <div className="flex flex-wrap gap-1">
              {giveVisible.map(c => <CodeChip key={c} code={c} variant="get" />)}
              {giveExtra > 0 && <CodeChip code={`+${giveExtra}`} variant="neutral" />}
              {giveVisible.length === 0 && (
                <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.25)' }}>—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MINI BARS ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 px-5 pb-4" style={{ flexShrink: 0 }}>
        <div>
          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(240,238,232,0.4)' }}>
            <span>Su álbum</span>
            <span style={{ color: '#4ade80' }}>{profile.completion}%</span>
          </div>
          <MiniBar pct={profile.completion} color="#4ade80" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(240,238,232,0.4)' }}>
            <span>Intercambio</span>
            <span style={{ color: '#FAC71E' }}>{profile.score} fig.</span>
          </div>
          <MiniBar pct={Math.min((profile.score / 20) * 100, 100)} color="#FAC71E" />
        </div>
      </div>

      {/* ── PERFECT BADGE ────────────────────────── */}
      {profile.perfect && (
        <div className="mx-5 mb-4" style={{ flexShrink: 0 }}>
          <PerfectBadge />
        </div>
      )}
    </div>
  );
}
