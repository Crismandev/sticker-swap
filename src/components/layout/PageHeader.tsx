export default function PageHeader({
  supertitle = 'PANINI · FIFA',
  title = 'WORLD CUP 2026',
  initials = 'U',
}: {
  supertitle?: string;
  title?: string;
  initials?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-6 pb-2">
      {/* Left: Logo area */}
      <div className="flex flex-col">
        <span
          className="text-[10px] font-body font-medium uppercase tracking-[0.18em]"
          style={{ color: '#FAC71E' }}
        >
          {supertitle}
        </span>
        <span
          className="font-display text-[28px] leading-none"
          style={{ color: '#f0eee8' }}
        >
          {title}
        </span>
      </div>

      {/* Right: Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-display text-lg"
        style={{
          background: 'linear-gradient(135deg, #FAC71E, #f0a500)',
          color: '#0a0a0f',
        }}
      >
        {initials}
      </div>
    </div>
  );
}
