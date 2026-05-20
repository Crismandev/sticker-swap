import type { Metadata, Viewport } from 'next';
import './globals.css';
import GridBackground from '@/components/layout/GridBackground';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Sticker Swap — FIFA World Cup 2026',
  description: 'Encuentra personas para intercambiar tus figuritas Panini del Mundial 2026.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full font-body antialiased" style={{ backgroundColor: '#0a0a0f' }}>
        <GridBackground>
          <main className="bottom-nav-pad">
            {children}
          </main>
          <BottomNav />
        </GridBackground>
      </body>
    </html>
  );
}
