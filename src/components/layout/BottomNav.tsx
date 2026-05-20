'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  {
    href: '/album',
    label: 'Album',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#FAC71E' : 'rgba(240,238,232,0.25)'}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="12" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="12" width="7" height="7" rx="1.5" />
        <rect x="12" y="12" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#FAC71E' : 'rgba(240,238,232,0.25)'}>
        <path d="M11 19.5C11 19.5 2.5 13.5 2.5 8a8.5 8.5 0 0 1 8.5-5.5A8.5 8.5 0 0 1 19.5 8c0 5.5-8.5 11.5-8.5 11.5z" />
        <circle cx="11" cy="8.5" r="2.5" />
      </svg>
    ),
  },
  {
    href: '/matches',
    label: 'Matches',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#FAC71E' : 'rgba(240,238,232,0.25)'}>
        <path d="M19 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4l4 4 4-4h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
        <line x1="7" y1="8" x2="15" y2="8" />
        <line x1="7" y1="11" x2="12" y2="11" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#FAC71E' : 'rgba(240,238,232,0.25)'}>
        <circle cx="11" cy="7" r="4" />
        <path d="M2 20c0-4.418 4.03-8 9-8s9 3.582 9 8" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around"
      style={{
        background: 'rgba(10,10,15,0.92)',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingTop: '10px',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {tabs.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            id={`nav-${label.toLowerCase()}`}
            className="flex flex-col items-center gap-1"
            aria-label={label}
          >
            {icon(active)}
            {/* Dot indicator */}
            <span
              className="block w-1 h-1 rounded-full bg-[#FAC71E]"
              style={{ opacity: active ? 1 : 0, transition: 'opacity 0.15s ease' }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
