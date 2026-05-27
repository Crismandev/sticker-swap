export default function ActionButtons({
  onReject,
  onAccept,
  onSuper,
  disabled = false,
}: {
  onReject: () => void;
  onAccept: () => void;
  onSuper:  () => void;
  disabled?: boolean;
}) {
  const btn = (
    id: string,
    onClick: () => void,
    icon: React.ReactNode,
    size: 'sm' | 'lg',
    colors: { border: string; bg: string; color: string; glow: string }
  ) => {
    const dim = size === 'lg' ? 62 : 46;
    return (
      <button
        id={id}
        disabled={disabled}
        onClick={onClick}
        className="flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-30 hover:scale-105"
        style={{
          width: dim, height: dim,
          borderRadius: '50%',
          border: `1.5px solid ${colors.border}`,
          background: colors.bg,
          color: colors.color,
          flexShrink: 0,
          boxShadow: `0 4px 16px ${colors.glow}`,
          cursor: 'pointer',
        }}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 px-4 mt-5">
      <div className="flex items-center justify-center gap-5">
        {btn('btn-reject-sm', onReject, (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ), 'sm', { border: 'rgba(255,71,87,0.25)', bg: 'rgba(255,71,87,0.08)', color: '#FF4757', glow: 'rgba(255,71,87,0.1)' }
        )}
        {btn('btn-accept', onAccept, (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ), 'lg', { border: 'rgba(46,213,115,0.35)', bg: 'rgba(46,213,115,0.12)', color: '#2ED573', glow: 'rgba(46,213,115,0.18)' }
        )}
        {btn('btn-super', onSuper, (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ), 'sm', { border: 'rgba(255,203,47,0.30)', bg: 'rgba(255,203,47,0.08)', color: '#FFCB2F', glow: 'rgba(255,203,47,0.1)' }
        )}
      </div>
      <div className="flex justify-between w-full px-4 mt-1">
        <span className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: 'rgba(240,238,232,0.22)' }}>← pasar</span>
        <span className="text-[10px] tracking-wider uppercase font-semibold" style={{ color: 'rgba(240,238,232,0.22)' }}>intercambiar →</span>
      </div>
    </div>
  );
}
