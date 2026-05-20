'use client';

import { usePathname } from 'next/navigation';

export default function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-bg min-h-screen w-full relative">
      {/* Gold glow top — solo pantallas principales */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[360px] h-[260px] -translate-y-1/4"
        style={{
          background: 'radial-gradient(circle, rgba(250,193,30,0.18) 0%, transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
