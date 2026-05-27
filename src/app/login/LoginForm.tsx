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

      {/* Divider + Toggle */}
      <div className="flex items-center gap-3 my-1">
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
