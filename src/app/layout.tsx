import type { Metadata, Viewport } from 'next';
import './globals.css';
import GridBackground from '@/components/layout/GridBackground';
import BottomNav from '@/components/layout/BottomNav';
import PageTransition from '@/components/layout/PageTransition';

export const metadata: Metadata = {
  title: 'Sticker Swap — FIFA World Cup 2026',
  description: 'Intercambia figuritas Panini del Mundial 2026 con otros coleccionistas.',
};

export const viewport: Viewport = {
  themeColor: '#08080e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import DesktopSidebar from '@/components/layout/DesktopSidebar';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased" style={{ backgroundColor: '#020205', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <AppProvider>
          <GridBackground>
          <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto min-h-screen relative flex flex-col md:flex-row border-x border-[rgba(255,255,255,0.06)] bg-[#08080e] shadow-2xl pb-16 md:pb-0">
            {/* Sidebar for desktop/tablet */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:border-r border-[rgba(255,255,255,0.06)] bg-[#08080e] p-6 shrink-0 relative z-50">
              <div className="mb-8">
                <span className="block text-[10px] uppercase tracking-[0.18em] font-semibold text-[#FFCB2F]">
                  MUNDIAL 2026
                </span>
                <span className="font-display text-[22px] leading-none text-[#f0eee8] font-bold block mt-1">
                  STICKER SWAP
                </span>
              </div>
              <DesktopSidebar />
            </aside>

            {/* Main content wrapper */}
            <main className="flex-1 min-w-0 relative flex flex-col">
              <div className="flex-1">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
            </main>

            {/* Bottom Nav for mobile only */}
            <div className="md:hidden">
              <BottomNav />
            </div>
          </div>
        </GridBackground>
       </AppProvider>
      </body>
    </html>
  );
}

