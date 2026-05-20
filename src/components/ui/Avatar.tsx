const AVATAR_COLORS = [
  ['#3b82f6', '#1d4ed8'],  // blue
  ['#a855f7', '#7e22ce'],  // purple
  ['#4ade80', '#15803d'],  // green
  ['#f97316', '#c2410c'],  // coral
  ['#FAC71E', '#d97706'],  // gold
  ['#ec4899', '#be185d'],  // pink
];

export default function Avatar({
  initials,
  size = 52,
  colorIndex = 0,
}: {
  initials: string;
  size?: number;
  colorIndex?: number;
}) {
  const [from, to] = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-display"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        fontSize,
        color: '#0a0a0f',
      }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
