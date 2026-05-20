export default function CodeChip({
  code,
  variant = 'neutral',
}: {
  code: string;
  variant?: 'neutral' | 'give' | 'get';
}) {
  const styles = {
    neutral: {
      bg: 'rgba(255,255,255,0.06)',
      border: 'rgba(255,255,255,0.1)',
      color: 'rgba(240,238,232,0.7)',
    },
    give: {
      bg: 'rgba(74,222,128,0.1)',
      border: 'rgba(74,222,128,0.2)',
      color: '#4ade80',
    },
    get: {
      bg: 'rgba(250,199,30,0.1)',
      border: 'rgba(250,199,30,0.2)',
      color: '#FAC71E',
    },
  };

  const s = styles[variant];

  return (
    <span
      className="inline-block text-[10px] font-bold font-body tracking-wide uppercase"
      style={{
        background: s.bg,
        border: `0.5px solid ${s.border}`,
        color: s.color,
        padding: '3px 7px',
        borderRadius: '6px',
      }}
    >
      {code.toUpperCase()}
    </span>
  );
}
