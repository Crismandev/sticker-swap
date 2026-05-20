'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  {
    href: '/album',
    label: 'Álbum',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FAC71E' : 'rgba(240,238,232,0.3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5"/>
      </svg>
    ),
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FAC71E' : 'rgba(240,238,232,0.3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21C12 21 4 14.5 4 9a8 8 0 0 1 16 0c0 5.5-8 12-8 12z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    href: '/matches',
    label: 'Matches',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FAC71E' : 'rgba(240,238,232,0.3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Perfil',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FAC71E' : 'rgba(240,238,232,0.3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center"
      style={{
        background: 'rgba(9,9,16,0.88)',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingTop: '10px',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            id={`nav-${label.toLowerCase()}`}
            className="flex flex-col items-center gap-1.5"
            aria-label={label}
          >
            {icon(active)}
            <span
              className="block w-1 h-1 rounded-full"
              style={{
                background: '#FAC71E',
                opacity: active ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
