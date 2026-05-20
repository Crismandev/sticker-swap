import CodeChip from '@/components/ui/CodeChip';
import PerfectBadge from '@/components/ui/PerfectBadge';
import Avatar from '@/components/ui/Avatar';

export type MatchProfile = {
  name: string;
  initials: string;
  city: string;
  completion: number;
  score: number;
  perfect: boolean;
  give: string[];
  get: string[];
  colorIndex?: number;
};

const MAX_CHIPS = 4;

function MiniProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full" style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '99px' }} />
    </div>
  );
}

export default function MatchCard({ profile }: { profile: MatchProfile }) {
  const giveVisible = profile.give.slice(0, MAX_CHIPS);
  const giveExtra   = profile.give.length - MAX_CHIPS;
  const getVisible  = profile.get.slice(0, MAX_CHIPS);
  const getExtra    = profile.get.length - MAX_CHIPS;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: '#12121a',
        border: '0.5px solid rgba(255,255,255,0.09)',
        borderRadius: '20px',
      }}
    >
      {/* ── CARD TOP ── */}
      <div
        className="flex items-center gap-3.5 p-5"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
      >
        <Avatar initials={profile.initials} size={52} colorIndex={profile.colorIndex ?? 0} />

        <div className="flex-1 min-w-0">
          <p className="font-display text-[22px] leading-none" style={{ color: '#f0eee8' }}>
            {profile.name.toUpperCase()}
          </p>
          <p className="mt-1 text-[12px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
            📍 {profile.city} · {profile.completion}% completado
          </p>
        </div>

        {/* Score badge */}
        <div
          className="flex-shrink-0 flex flex-col items-center px-3 py-2"
          style={{
            background: 'rgba(250,199,30,0.1)',
            border: '0.5px solid rgba(250,199,30,0.25)',
            borderRadius: '12px',
          }}
        >
          <span className="font-display text-[26px] leading-none" style={{ color: '#FAC71E' }}>
            {profile.score}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-body" style={{ color: 'rgba(250,199,30,0.6)' }}>
            FIGURITAS
          </span>
        </div>
      </div>

      {/* ── EXCHANGE SECTION ── */}
      <div className="px-5 py-3.5">
        <p className="text-[10px] uppercase tracking-wider mb-3 font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
          PROPUESTA DE INTERCAMBIO
        </p>

        <div className="flex items-start gap-3">
          {/* Tú le das */}
          <div className="flex-1">
            <p className="flex items-center gap-1 text-[10px] font-body mb-2" style={{ color: '#4ade80' }}>
              <span>↑</span> Tú le das
            </p>
            <div className="flex flex-wrap gap-1">
              {giveVisible.map(c => <CodeChip key={c} code={c} variant="give" />)}
              {giveExtra > 0 && <CodeChip code={`+${giveExtra}`} variant="neutral" />}
            </div>
          </div>

          {/* Arrows */}
          <div className="flex flex-col items-center pt-3 gap-1 text-[14px]">
            <span style={{ color: '#4ade80' }}>↑</span>
            <span style={{ color: '#FAC71E' }}>↓</span>
          </div>

          {/* Recibes */}
          <div className="flex-1">
            <p className="flex items-center gap-1 text-[10px] font-body mb-2" style={{ color: '#FAC71E' }}>
              <span>↓</span> Recibes
            </p>
            <div className="flex flex-wrap gap-1">
              {getVisible.map(c => <CodeChip key={c} code={c} variant="get" />)}
              {getExtra > 0 && <CodeChip code={`+${getExtra}`} variant="neutral" />}
            </div>
          </div>
        </div>
      </div>

      {/* ── COMPLETION BARS ── */}
      <div className="grid grid-cols-2 gap-2 mx-5 mb-3.5">
        <div>
          <p className="text-[10px] mb-1 font-body flex justify-between" style={{ color: 'rgba(240,238,232,0.45)' }}>
            <span>Tu álbum</span>
            <span style={{ color: '#4ade80' }}>62%</span>
          </p>
          <MiniProgressBar pct={62} color="#4ade80" />
        </div>
        <div>
          <p className="text-[10px] mb-1 font-body flex justify-between" style={{ color: 'rgba(240,238,232,0.45)' }}>
            <span>Su álbum</span>
            <span style={{ color: '#FAC71E' }}>{profile.completion}%</span>
          </p>
          <MiniProgressBar pct={profile.completion} color="#FAC71E" />
        </div>
      </div>

      {/* ── PERFECT BADGE ── */}
      {profile.perfect && (
        <div className="mx-5 mb-4">
          <PerfectBadge />
        </div>
      )}
    </div>
  );
}
