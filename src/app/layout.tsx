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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased" style={{ backgroundColor: '#020205', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <GridBackground>
          <div className="w-full max-w-md mx-auto min-h-screen relative flex flex-col border-x border-[rgba(255,255,255,0.06)] bg-[#08080e] shadow-2xl">
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <BottomNav />
          </div>
        </GridBackground>
      </body>
    </html>
  );
}

