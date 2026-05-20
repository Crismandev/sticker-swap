export default function ActionButtons({
  onSkip,
  onReject,
  onAccept,
  onSuper,
}: {
  onSkip: () => void;
  onReject: () => void;
  onAccept: () => void;
  onSuper: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 px-4">
      <div className="flex items-center justify-center gap-4">
        {/* Skip sm */}
        <button
          id="btn-skip"
          onClick={onSkip}
          className="flex items-center justify-center card-hover-transition active:scale-95"
          style={{
            width: 44, height: 44,
            borderRadius: '99px',
            border: '0.5px solid rgba(251,113,133,0.3)',
            background: 'rgba(251,113,133,0.07)',
            color: '#fb7185',
            fontSize: 16,
          }}
        >↺</button>

        {/* Reject lg */}
        <button
          id="btn-reject"
          onClick={onReject}
          className="flex items-center justify-center card-hover-transition active:scale-95"
          style={{
            width: 60, height: 60,
            borderRadius: '99px',
            border: '0.5px solid rgba(251,113,133,0.35)',
            background: 'rgba(251,113,133,0.07)',
            color: '#fb7185',
            fontSize: 22,
          }}
        >✕</button>

        {/* Accept lg */}
        <button
          id="btn-accept"
          onClick={onAccept}
          className="flex items-center justify-center card-hover-transition active:scale-95"
          style={{
            width: 60, height: 60,
            borderRadius: '99px',
            border: '0.5px solid rgba(74,222,128,0.35)',
            background: 'rgba(74,222,128,0.1)',
            color: '#4ade80',
            fontSize: 22,
          }}
        >✓</button>

        {/* Super sm */}
        <button
          id="btn-super"
          onClick={onSuper}
          className="flex items-center justify-center card-hover-transition active:scale-95"
          style={{
            width: 44, height: 44,
            borderRadius: '99px',
            border: '0.5px solid rgba(250,199,30,0.35)',
            background: 'rgba(250,199,30,0.1)',
            color: '#FAC71E',
            fontSize: 16,
          }}
        >★</button>
      </div>

      {/* Hints */}
      <div className="flex justify-between w-full px-4 mt-1">
        <span className="text-[10px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>← desliza para saltar</span>
        <span className="text-[10px] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>desliza para intercambiar →</span>
      </div>
    </div>
  );
}
