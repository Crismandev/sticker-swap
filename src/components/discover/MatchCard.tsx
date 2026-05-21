import CodeChip from '@/components/ui/CodeChip';
import PerfectBadge from '@/components/ui/PerfectBadge';
import Avatar from '@/components/ui/Avatar';

export type MatchProfile = {
  userId: string;
  name: string;
  initials: string;
  city: string;
  completion: number;
  canGive: number;
  canReceive: number;
  score: number;
  perfect: boolean;
  giveCodes: string[];
  getCodes: string[];
  colorIndex?: number;
};

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{
        width: `${Math.min(pct, 100)}%`,
        height: '100%',
        background: color,
        borderRadius: 99,
        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${color}80`,
      }} />
    </div>
  );
}

const MAX_CHIPS = 5;

export default function MatchCard({ profile, style }: { profile: MatchProfile; style?: React.CSSProperties }) {
  const giveVisible = profile.giveCodes.slice(0, MAX_CHIPS);
  const giveExtra   = profile.giveCodes.length - MAX_CHIPS;
  const getVisible  = profile.getCodes.slice(0, MAX_CHIPS);
  const getExtra    = profile.getCodes.length - MAX_CHIPS;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #131320 0%, #0f0f1c 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 22,
        ...style,
      }}
    >
      {/* Top accent line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #FFCB2F, #2ED573)', borderRadius: '22px 22px 0 0', flexShrink: 0 }} />

      {/* ── HEADER ─────────────────────────────────── */}
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
      >
        <Avatar initials={profile.initials} size={56} colorIndex={profile.colorIndex ?? 0} />

        <div className="flex-1 min-w-0">
          <p className="font-display text-[24px] leading-none" style={{ color: '#f0eee8' }}>
            {profile.name.toUpperCase()}
          </p>
          <p className="mt-1 text-[12px] font-body" style={{ color: 'rgba(240,238,232,0.40)' }}>
            {profile.city ? `📍 ${profile.city}  ·  ` : ''}{profile.completion}% completado
          </p>
        </div>

        {/* Score bubble */}
        <div
          className="flex-shrink-0 flex flex-col items-center px-3 py-2 animate-glow-pulse"
          style={{
            background: 'rgba(255,203,47,0.10)',
            border: '1px solid rgba(255,203,47,0.28)',
            borderRadius: 14,
            minWidth: 58,
          }}
        >
          <span className="font-display text-[28px] leading-none" style={{ color: '#FFCB2F' }}>{profile.score}</span>
          <span className="text-[9px] uppercase tracking-wider font-body" style={{ color: 'rgba(255,203,47,0.65)' }}>fig.</span>
        </div>
      </div>

      {/* ── EXCHANGE ──────────────────────────────── */}
      <div className="px-5 py-4 flex-1 overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3.5 font-body" style={{ color: 'rgba(240,238,232,0.28)' }}>
          PROPUESTA DE INTERCAMBIO
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* They give you */}
          <div>
            <p className="text-[10px] font-bold mb-2 flex items-center gap-1.5 font-body" style={{ color: '#2ED573' }}>
              <span className="text-[14px]">↓</span> Te dan
            </p>
            <div className="flex flex-wrap gap-1">
              {getVisible.map(c => <CodeChip key={c} code={c} variant="give" />)}
              {getExtra > 0 && <CodeChip code={`+${getExtra}`} variant="neutral" />}
              {getVisible.length === 0 && (
                <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.22)' }}>—</span>
              )}
            </div>
          </div>

          {/* You give */}
          <div>
            <p className="text-[10px] font-bold mb-2 flex items-center gap-1.5 font-body" style={{ color: '#FFCB2F' }}>
              <span className="text-[14px]">↑</span> Tú das
            </p>
            <div className="flex flex-wrap gap-1">
              {giveVisible.map(c => <CodeChip key={c} code={c} variant="get" />)}
              {giveExtra > 0 && <CodeChip code={`+${giveExtra}`} variant="neutral" />}
              {giveVisible.length === 0 && (
                <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.22)' }}>—</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MINI BARS ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5 px-5 pb-4" style={{ flexShrink: 0 }}>
        <div>
          <div className="flex justify-between text-[10px] mb-1.5 font-body" style={{ color: 'rgba(240,238,232,0.4)' }}>
            <span>Su álbum</span>
            <span style={{ color: '#2ED573' }}>{profile.completion}%</span>
          </div>
          <MiniBar pct={profile.completion} color="#2ED573" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1.5 font-body" style={{ color: 'rgba(240,238,232,0.4)' }}>
            <span>Match</span>
            <span style={{ color: '#FFCB2F' }}>{profile.score} fig.</span>
          </div>
          <MiniBar pct={Math.min((profile.score / 20) * 100, 100)} color="#FFCB2F" />
        </div>
      </div>

      {/* ── PERFECT BADGE ─────────────────────────── */}
      {profile.perfect && (
        <div className="mx-5 mb-4" style={{ flexShrink: 0 }}>
          <PerfectBadge />
        </div>
      )}
    </div>
  );
}
