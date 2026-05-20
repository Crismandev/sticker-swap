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
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        // Create user profile in 'users' table
        if (data.user) {
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            username: username || email.split('@')[0],
            display_name: username || email.split('@')[0],
          });
        }
        
        alert('Cuenta creada exitosamente. Por favor, revisa tu correo o inicia sesión.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
      <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-3">
        {isRegistering && (
          <div>
            <label className="sr-only">Usuario</label>
            <input
              name="username"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#8A1538] focus:border-[#8A1538] sm:text-sm"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="sr-only">Email</label>
          <input
            name="email"
            type="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#8A1538] focus:border-[#8A1538] sm:text-sm"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="sr-only">Contraseña</label>
          <input
            name="password"
            type="password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#8A1538] focus:border-[#8A1538] sm:text-sm"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8A1538] hover:bg-[#6e112d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A1538]"
        >
          {loading ? 'Cargando...' : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión')}
        </button>
      </div>
      
      <div className="text-sm text-center">
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="font-medium text-[#8A1538] hover:text-[#6e112d]"
        >
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </form>
  );
}
