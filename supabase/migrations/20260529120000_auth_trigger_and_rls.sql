-- ============================================================
-- MIGRACIÓN: Trigger de Creación Automática de Perfil y RLS
-- ============================================================

-- 1. Añadir política de inserción en la tabla users
-- Esto permite que el cliente inserte su propio perfil si es necesario
CREATE POLICY "users_insert_own" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Función de trigger para crear perfil automáticamente al registrarse (Email o Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INT := 1;
BEGIN
  -- Definir el username base (meta_data o prefijo de email)
  base_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  final_username := base_username;
  
  -- Bucle para garantizar que el username sea único
  WHILE EXISTS (SELECT 1 FROM public.users WHERE username = final_username) LOOP
    final_username := base_username || suffix::TEXT;
    suffix := suffix + 1;
  END LOOP;

  -- Insertar el perfil público
  INSERT INTO public.users (id, email, username, display_name, avatar_url, country)
  VALUES (
    new.id,
    new.email,
    final_username,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'PE'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = excluded.email,
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url);
      
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el trigger sobre auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
