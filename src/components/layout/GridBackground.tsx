'use client';

export default function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-bg min-h-screen w-full relative" style={{ background: '#08080e' }}>
      {/* Radial gold glow top-center — visible on all screens */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[420px] h-[280px] -translate-y-1/3"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,203,47,0.10) 0%, transparent 68%)',
          zIndex: 0,
        }}
      />
      {/* Deep purple glow bottom */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px]"
        style={{
          background: 'radial-gradient(ellipse, rgba(80,40,160,0.12) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
