type BadgeVariant = 'owned' | 'repeated' | 'foil' | 'perfect' | 'missing';

const styles: Record<BadgeVariant, { bg: string; border: string; color: string; label: string }> = {
  owned:    { bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.3)',   color: '#4ade80', label: 'Pegada' },
  repeated: { bg: 'rgba(250,199,30,0.1)',   border: 'rgba(250,199,30,0.3)',   color: '#FAC71E', label: 'Repetida' },
  foil:     { bg: 'rgba(192,160,255,0.1)',  border: 'rgba(192,160,255,0.3)',  color: 'rgba(192,160,255,0.9)', label: 'FOIL' },
  perfect:  { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)',  color: '#4ade80', label: 'Match Perfecto' },
  missing:  { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.25)', color: '#fb7185', label: 'Falta' },
};

export default function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children?: React.ReactNode;
}) {
  const s = styles[variant];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
      style={{
        background: s.bg,
        border: `0.5px solid ${s.border}`,
        borderRadius: '10px',
        color: s.color,
      }}
    >
      {children ?? s.label}
    </span>
  );
}
