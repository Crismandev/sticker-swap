/**
 * Skeleton loaders — Phase 8 PWA visual improvements
 * All skeletons use the .skeleton shimmer class from globals.css
 */

function SkeletonBlock({ w = '100%', h = 16, radius = 10, className = '' }: {
  w?: string | number;
  h?: number;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: w, height: h, borderRadius: radius, flexShrink: 0 }}
    />
  );
}

/* ── Album menu skeleton ── */
export function AlbumMenuSkeleton() {
  return (
    <div className="relative min-h-screen nav-pad animate-fade-in px-5" style={{ background: '#08080e' }}>
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-5">
        <div className="flex flex-col gap-2">
          <SkeletonBlock w={80} h={10} radius={6} />
          <SkeletonBlock w={200} h={36} radius={10} />
        </div>
        <SkeletonBlock w={84} h={44} radius={16} />
      </div>

      {/* Progress bar */}
      <SkeletonBlock w="100%" h={8} radius={99} className="mb-3" />
      <div className="flex justify-between mb-5">
        <SkeletonBlock w={100} h={12} radius={6} />
        <SkeletonBlock w={48} h={20} radius={6} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {[0, 1, 2].map(i => <SkeletonBlock key={i} h={64} radius={14} />)}
      </div>

      {/* Quick load button */}
      <SkeletonBlock h={52} radius={18} className="mb-8" />

      {/* Divider */}
      <SkeletonBlock h={1} radius={1} className="mb-6 opacity-50" />

      {/* Section grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} h={130} radius={20} />)}
      </div>
    </div>
  );
}

/* ── Discover skeleton ── */
export function DiscoverSkeleton() {
  return (
    <div className="relative min-h-screen nav-pad animate-fade-in" style={{ background: '#08080e' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-7 pb-4">
        <div className="flex flex-col gap-2">
          <SkeletonBlock w={100} h={10} radius={6} />
          <SkeletonBlock w={200} h={34} radius={10} />
        </div>
        <SkeletonBlock w={64} h={52} radius={14} />
      </div>

      {/* Card stack placeholder */}
      <div className="mx-4 relative" style={{ height: 'min(520px, 65vh)' }}>
        {/* Back cards */}
        <div className="absolute inset-0" style={{ transform: 'scale(0.88) translateY(32px)', opacity: 0.24 }}>
          <SkeletonBlock w="100%" h="100%" radius={22} />
        </div>
        <div className="absolute inset-0" style={{ transform: 'scale(0.94) translateY(16px)', opacity: 0.50 }}>
          <SkeletonBlock w="100%" h="100%" radius={22} />
        </div>
        {/* Top card */}
        <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ borderRadius: 22 }}>
          <SkeletonBlock w="100%" h="100%" radius={22} />
          {/* Inner details shimmer */}
          <div className="absolute inset-0 p-5 flex flex-col gap-4 pointer-events-none">
            <div className="flex items-center gap-4 pt-3">
              <SkeletonBlock w={56} h={56} radius={99} />
              <div className="flex flex-col gap-2 flex-1">
                <SkeletonBlock w="60%" h={24} radius={8} />
                <SkeletonBlock w="40%" h={12} radius={6} />
              </div>
              <SkeletonBlock w={58} h={52} radius={14} />
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 -4px' }} />
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="flex flex-col gap-2">
                <SkeletonBlock w="50%" h={12} radius={6} />
                <div className="flex flex-wrap gap-1.5">
                  {[48, 56, 44, 52].map((w, i) => <SkeletonBlock key={i} w={w} h={22} radius={6} />)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <SkeletonBlock w="50%" h={12} radius={6} />
                <div className="flex flex-wrap gap-1.5">
                  {[52, 44, 56, 48].map((w, i) => <SkeletonBlock key={i} w={w} h={22} radius={6} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center items-center gap-5 mt-6 px-8">
        <SkeletonBlock w={56} h={56} radius={99} />
        <SkeletonBlock w={68} h={68} radius={99} />
        <SkeletonBlock w={56} h={56} radius={99} />
      </div>
    </div>
  );
}

/* ── Profile skeleton ── */
export function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen nav-pad animate-fade-in" style={{ background: '#08080e' }}>
      {/* Hero header */}
      <div
        className="px-5 pb-8 pt-10 flex flex-col items-center gap-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg,#161628,#08080e)' }}
      >
        <SkeletonBlock w={96} h={96} radius={99} />
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <SkeletonBlock w="55%" h={30} radius={10} />
          <SkeletonBlock w="70%" h={14} radius={6} />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 w-full mt-2">
          {[0, 1, 2].map(i => <SkeletonBlock key={i} h={64} radius={14} />)}
        </div>
        {/* Action buttons */}
        <SkeletonBlock h={52} radius={14} className="w-full" />
        <div className="flex gap-2.5 w-full">
          <SkeletonBlock h={46} radius={14} className="flex-1" />
          <SkeletonBlock h={46} radius={14} className="flex-1" />
        </div>
      </div>

      {/* Lists */}
      <div className="px-5 pt-6 flex flex-col gap-3">
        <SkeletonBlock w={180} h={22} radius={8} />
        <div className="flex flex-wrap gap-2">
          {[52, 44, 60, 48, 56, 44, 52].map((w, i) => <SkeletonBlock key={i} w={w} h={28} radius={8} />)}
        </div>
        <div className="mt-4">
          <SkeletonBlock w={160} h={22} radius={8} className="mb-3" />
          <div className="flex flex-wrap gap-2">
            {[44, 56, 48, 60, 52, 44].map((w, i) => <SkeletonBlock key={i} w={w} h={28} radius={8} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Generic full-screen pulse ── */
export function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#08080e' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="animate-float text-[48px] leading-none"
          style={{ filter: 'drop-shadow(0 0 16px rgba(255,203,47,0.35))' }}
        >
          🏆
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
              style={{ background: '#FFCB2F', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
