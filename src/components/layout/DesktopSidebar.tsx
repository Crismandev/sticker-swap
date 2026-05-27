'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  {
    href: '/album',
    label: 'Álbum',
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="2"/>
        <rect x="13" y="3" width="8" height="8" rx="2"/>
        <rect x="3" y="13" width="8" height="8" rx="2"/>
        <rect x="13" y="13" width="8" height="8" rx="2"/>
      </svg>
    ),
  },
  {
    href: '/discover',
    label: 'Intercambiar (Swap)',
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
      </svg>
    ),
  },
  {
    href: '/matches',
    label: 'Matches',
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Mi Perfil',
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={a ? '#FFCB2F' : 'rgba(240,238,232,0.35)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      {NAV.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.03] active:scale-[0.98] font-body text-[14px]"
            style={{
              color: active ? '#FFCB2F' : 'rgba(240,238,232,0.45)',
              background: active ? 'rgba(255,203,47,0.06)' : 'transparent',
              border: active ? '1px solid rgba(255,203,47,0.15)' : '1px solid transparent',
              fontWeight: active ? 600 : 500,
            }}
          >
            {icon(active)}
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
