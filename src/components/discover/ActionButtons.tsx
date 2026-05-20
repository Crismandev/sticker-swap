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
    content: React.ReactNode,
    size: 'sm' | 'lg',
    colors: { border: string; bg: string; color: string }
  ) => {
    const dim = size === 'lg' ? 60 : 46;
    return (
      <button
        id={id}
        disabled={disabled}
        onClick={onClick}
        className="flex items-center justify-center transition-state active:scale-90 disabled:opacity-30"
        style={{
          width: dim, height: dim,
          borderRadius: '50%',
          border: `0.5px solid ${colors.border}`,
          background: colors.bg,
          color: colors.color,
          fontSize: size === 'lg' ? 22 : 16,
          flexShrink: 0,
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 px-4 mt-4">
      <div className="flex items-center justify-center gap-4">
        {btn('btn-reject-sm', onReject, '✕',
          'sm', { border: 'rgba(251,113,133,0.3)', bg: 'rgba(251,113,133,0.07)', color: '#fb7185' }
        )}
        {btn('btn-accept', onAccept, '✓',
          'lg', { border: 'rgba(74,222,128,0.4)', bg: 'rgba(74,222,128,0.1)', color: '#4ade80' }
        )}
        {btn('btn-super', onSuper, '★',
          'sm', { border: 'rgba(250,199,30,0.35)', bg: 'rgba(250,199,30,0.08)', color: '#FAC71E' }
        )}
      </div>
      <div className="flex justify-between w-full px-2">
        <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.22)' }}>← pasar</span>
        <span className="text-[10px]" style={{ color: 'rgba(240,238,232,0.22)' }}>intercambiar →</span>
      </div>
    </div>
  );
}
