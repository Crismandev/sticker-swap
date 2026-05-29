'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            username: username || email.split('@')[0],
            display_name: username || email.split('@')[0],
          });
        }
        setSuccessMsg('¡Cuenta creada! Revisa tu correo o inicia sesión.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al iniciar sesión con Google.');
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-[14px] text-[14px] font-body
    bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
    focus:outline-none focus:border-[#FFCB2F] focus:bg-[rgba(255,255,255,0.07)]
    transition-all duration-200 text-[#f0eee8]
    placeholder:text-[rgba(240,238,232,0.25)]
  `;

  return (
    <form onSubmit={handleAuth} className="flex flex-col gap-4">
      {/* Mode title */}
      <div className="text-center mb-1">
        <h2 className="font-display text-[28px] leading-none" style={{ color: '#f0eee8' }}>
          {isRegistering ? 'CREAR CUENTA' : 'BIENVENIDO'}
        </h2>
        <p className="text-[12px] mt-1 font-body" style={{ color: 'rgba(240,238,232,0.4)' }}>
          {isRegistering ? 'Únete a la comunidad coleccionista' : 'Ingresa a tu colección'}
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        {isRegistering && (
          <input
            name="username"
            type="text"
            required
            className={inputClass}
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          name="password"
          type="password"
          required
          className={inputClass}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error / Success messages */}
      {errorMsg && (
        <div className="px-4 py-2.5 rounded-xl text-[12px] font-body" style={{ background: 'rgba(255,71,87,0.10)', border: '1px solid rgba(255,71,87,0.25)', color: '#FF4757' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="px-4 py-2.5 rounded-xl text-[12px] font-body" style={{ background: 'rgba(46,213,115,0.10)', border: '1px solid rgba(46,213,115,0.25)', color: '#2ED573' }}>
          {successMsg}
        </div>
      )}

      {/* CTA Button */}
      <button
        type="submit"
        disabled={loading}
        className="relative w-full py-3.5 rounded-[14px] font-body font-bold text-[15px] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
        style={{ background: '#FFCB2F', color: '#08080e', boxShadow: '0 4px 20px rgba(255,203,47,0.30)', cursor: 'pointer' }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#08080e] border-t-transparent animate-spin inline-block" />
            Procesando...
          </span>
        ) : (
          isRegistering ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="16" y1="11" x2="22" y2="11"></line>
              </svg>
              Crear mi cuenta
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Iniciar sesión
            </>
          )
        )}
      </button>

      {/* Divider "o continuar con" */}
      <div className="flex items-center gap-3 my-0.5">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span className="text-[10px] font-body uppercase tracking-[0.15em]" style={{ color: 'rgba(240,238,232,0.25)' }}>
          o continuar con
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 rounded-[14px] font-body font-semibold text-[14px] transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f0eee8',
          cursor: 'pointer',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
        Google
      </button>

      {/* Divider + Toggle */}
      <div className="flex items-center gap-3 my-0.5">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-[11px] font-body" style={{ color: 'rgba(240,238,232,0.3)' }}>
          {isRegistering ? '¿ya tienes cuenta?' : '¿nuevo por aquí?'}
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <button
        type="button"
        onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); setSuccessMsg(''); }}
        className="w-full py-3 rounded-[14px] font-body font-semibold text-[14px] transition-all active:scale-[0.97] hover:scale-[1.01]"
        style={{ background: 'rgba(255,203,47,0.08)', border: '1px solid rgba(255,203,47,0.22)', color: '#FFCB2F', cursor: 'pointer' }}
      >
        {isRegistering ? 'Iniciar sesión →' : 'Crear cuenta gratis →'}
      </button>
    </form>
  );
}
