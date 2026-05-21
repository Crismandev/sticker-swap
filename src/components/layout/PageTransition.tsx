'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [displayedPath, setDisplayedPath] = useState(pathname);

  useEffect(() => {
    // Fade out
    setIsVisible(false);

    const swapTimer = setTimeout(() => {
      setDisplayedPath(pathname);
      // Fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    }, 140);

    return () => clearTimeout(swapTimer);
  }, [pathname]);

  // Initial mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
