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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-8 overflow-hidden" style={{ background: '#08080e' }}>

      {/* Stadium glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,203,47,0.06) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 55%)'
      }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Hero — Gold Vector Emblem + Title */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-4 transition-all duration-300 hover:scale-105 active:scale-95 animate-float" style={{
          background: 'linear-gradient(135deg, rgba(255,203,47,0.18) 0%, rgba(255,203,47,0.03) 100%)',
          border: '1.5px solid rgba(255,203,47,0.25)',
          boxShadow: '0 8px 30px rgba(255,203,47,0.15), inset 0 2px 8px rgba(255,203,47,0.1)'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFCB2F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
            <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-body mb-1" style={{ color: 'rgba(255,203,47,0.8)' }}>
            PANINI · FIFA
          </p>
          <h1 className="font-display text-[46px] leading-none tracking-tight font-black" style={{ color: '#f0eee8' }}>
            STICKER SWAP
          </h1>
          <p className="mt-1.5 text-[12px] font-body" style={{ color: 'rgba(240,238,232,0.45)' }}>
            Intercambia figuritas del Mundial 2026
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-[22px] p-6 shadow-2xl border border-[rgba(255,255,255,0.06)]" style={{
          background: 'rgba(15, 15, 28, 0.65)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)'
        }}>
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-6 text-[9px] tracking-[0.25em] font-mono opacity-25 uppercase" style={{ color: '#f0eee8' }}>
        pixelia · crisman
      </p>
    </div>
  );
}

