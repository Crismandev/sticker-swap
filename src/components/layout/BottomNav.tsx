'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  {
    href: '/album',
    label: 'Álbum',
    center: false,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="2"/>
        <rect x="13" y="3" width="8" height="8" rx="2"/>
        <rect x="3" y="13" width="8" height="8" rx="2"/>
        <rect x="13" y="13" width="8" height="8" rx="2"/>
      </svg>
    ),
  },
  {
    href: '/discover',
    label: 'Swap',
    center: true,
    icon: (_a: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#08080e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
      </svg>
    ),
  },
  {
    href: '/matches',
    label: 'Matches',
    center: false,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Perfil',
    center: false,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 flex justify-around items-end"
      style={{
        background: 'rgba(8,8,14,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        paddingTop: '10px',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {NAV.map(({ href, label, icon, center }) => {
        const active = pathname === href || pathname.startsWith(href + '/');

        if (center) {
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              className="flex flex-col items-center gap-1.5 pb-1"
              aria-label={label}
            >
              <div
                className="flex items-center justify-center transition-all active:scale-90"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FFCB2F, #f0a500)',
                  boxShadow: '0 4px 24px rgba(255,203,47,0.40), 0 2px 8px rgba(255,203,47,0.20)',
                  transform: 'translateY(-10px)',
                }}
              >
                {icon(active)}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.12em] font-body"
                style={{ color: '#FFCB2F', marginTop: -4 }}
              >
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            id={`nav-${label.toLowerCase()}`}
            className="flex flex-col items-center gap-1.5 px-3"
            aria-label={label}
          >
            <div
              className="flex items-center justify-center rounded-[12px]"
              style={{
                width: 44,
                height: 36,
                background: active ? 'rgba(255,203,47,0.10)' : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              {icon(active)}
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.10em] font-body"
              style={{
                color: active ? '#FFCB2F' : 'rgba(240,238,232,0.35)',
                transition: 'color 0.2s ease',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
