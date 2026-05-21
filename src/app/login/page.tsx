import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10 overflow-hidden" style={{ background: '#08080e' }}>

      {/* Stadium glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 110%, rgba(255,203,47,0.10) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% -10%, rgba(60,40,140,0.20) 0%, transparent 65%)'
      }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Hero — Trophy + Title */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="animate-float text-[72px] leading-none mb-3 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 24px rgba(255,203,47,0.4))' }}>
          🏆
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] font-body mb-1" style={{ color: 'rgba(255,203,47,0.7)' }}>
            PANINI · FIFA
          </p>
          <h1 className="font-display text-[52px] leading-none tracking-wide" style={{ color: '#f0eee8' }}>
            STICKER SWAP
          </h1>
          <p className="mt-2 text-[13px] font-body" style={{ color: 'rgba(240,238,232,0.45)' }}>
            Intercambia figuritas del Mundial 2026
          </p>
        </div>
      </div>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="glass rounded-[24px] p-6">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-6 text-[10px] tracking-widest font-mono opacity-30" style={{ color: '#f0eee8' }}>
        pixelia · crisman
      </p>
    </div>
  );
}

