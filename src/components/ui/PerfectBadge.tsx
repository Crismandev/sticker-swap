export default function PerfectBadge() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 text-xs font-medium"
      style={{
        background: 'rgba(74,222,128,0.08)',
        border: '0.5px solid rgba(74,222,128,0.2)',
        borderRadius: '10px',
        color: '#4ade80',
      }}
    >
      <span
        className="animate-pulse-dot block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: '#4ade80' }}
      />
      Match perfecto — ambos se benefician por igual
    </div>
  );
}
