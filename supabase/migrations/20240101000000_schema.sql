-- ============================================================
-- STICKER SWAP APP — Schema Principal
-- Panini FIFA World Cup 2026 + soporte multi-álbum
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: albums
-- Un álbum por torneo (Mundial 2026, Copa América, etc.)
-- ============================================================
CREATE TABLE albums (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,              -- "FIFA World Cup 2026"
  publisher     TEXT NOT NULL DEFAULT 'Panini',
  year          INT  NOT NULL,              -- 2026
  total_stickers INT NOT NULL,             -- 980
  cover_image   TEXT,                      -- URL imagen de portada
  is_active     BOOLEAN DEFAULT true,      -- álbum visible en la app
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: sections
-- Cada sección del álbum (FWC, MEX, ARG, BRA, etc.)
-- ============================================================
CREATE TABLE sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id      UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,             -- "FWC", "MEX", "ARG"
  name          TEXT NOT NULL,             -- "Sección Especial", "México"
  flag_emoji    TEXT,                      -- 🇲🇽 🇦🇷 🏆
  color_primary TEXT DEFAULT '#1a73e8',   -- color principal del equipo (hex)
  order_index   INT  NOT NULL DEFAULT 0,  -- orden visual en el álbum
  section_type  TEXT DEFAULT 'team'       -- 'team' | 'special'
                CHECK (section_type IN ('team','special')),
  UNIQUE(album_id, code)
);

-- ============================================================
-- TABLA: stickers
-- Cada figurita individual del álbum
-- ============================================================
CREATE TABLE stickers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id    UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,             -- "MEX1", "FWC3", "ARG17"
  name          TEXT NOT NULL,             -- "Lionel Messi", "Official Ball"
  order_index   INT  NOT NULL DEFAULT 0,  -- posición dentro de la sección
  is_foil       BOOLEAN DEFAULT false,    -- figurita brillante/especial
  sticker_type  TEXT DEFAULT 'player'
                CHECK (sticker_type IN ('player','team_photo','badge','special','history')),
  UNIQUE(section_id, code)
);

-- Índice para búsquedas rápidas por código global
CREATE INDEX idx_stickers_code ON stickers(code);

-- ============================================================
-- TABLA: users
-- Usuarios de la app
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  city          TEXT,                      -- ciudad (texto libre)
  country       TEXT DEFAULT 'PE',        -- código país ISO
  share_token   TEXT UNIQUE DEFAULT encode(extensions.gen_random_bytes(6), 'hex'),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_share_token ON users(share_token);

-- ============================================================
-- TABLA: user_stickers
-- El estado de cada figurita para cada usuario
-- ============================================================
CREATE TABLE user_stickers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sticker_id    UUID NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'wanted'
                CHECK (status IN ('owned','repeated','wanted')),
  -- 'owned'    = la tiene pegada en el álbum físico
  -- 'repeated' = tiene copias extras para intercambiar
  -- 'wanted'   = le falta (estado por defecto implícito)
  quantity      INT  NOT NULL DEFAULT 1   CHECK (quantity >= 1),
  -- quantity solo aplica cuando status = 'repeated'
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sticker_id)
);

CREATE INDEX idx_user_stickers_user    ON user_stickers(user_id);
CREATE INDEX idx_user_stickers_status  ON user_stickers(user_id, status);
CREATE INDEX idx_user_stickers_sticker ON user_stickers(sticker_id);

-- ============================================================
-- TABLA: swap_matches
-- Matches entre dos usuarios (como Tinder)
-- ============================================================
CREATE TABLE swap_matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_score   INT  NOT NULL DEFAULT 0, -- total figuritas intercambiables
  can_give      INT  NOT NULL DEFAULT 0, -- A puede dar a B
  can_receive   INT  NOT NULL DEFAULT 0, -- A puede recibir de B
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','completed','rejected')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Garantizar que no haya duplicados (A-B y B-A son el mismo match)
CREATE UNIQUE INDEX idx_swap_matches_unique ON swap_matches(
  LEAST(user_a_id::TEXT, user_b_id::TEXT), 
  GREATEST(user_a_id::TEXT, user_b_id::TEXT)
);

CREATE INDEX idx_swap_matches_user_a ON swap_matches(user_a_id);
CREATE INDEX idx_swap_matches_user_b ON swap_matches(user_b_id);

-- ============================================================
-- TABLA: swap_messages
-- Chat dentro de cada match
-- ============================================================
CREATE TABLE swap_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id      UUID NOT NULL REFERENCES swap_matches(id) ON DELETE CASCADE,
  sender_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_swap_messages_match ON swap_messages(match_id, created_at);

-- ============================================================
-- FUNCIÓN: calcular matches para un usuario
-- Retorna los mejores candidatos de intercambio
-- ============================================================
CREATE OR REPLACE FUNCTION find_matches(current_user_id UUID, album_id_filter UUID)
RETURNS TABLE (
  user_id       UUID,
  username      TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  city          TEXT,
  can_give      INT,
  can_receive   INT,
  match_score   INT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT
    u.id                                                           AS user_id,
    u.username,
    u.display_name,
    u.avatar_url,
    u.city,
    COUNT(CASE WHEN a.status='repeated' AND b.status IN ('wanted','owned') THEN 1 END)::INT AS can_give,
    COUNT(CASE WHEN b.status='repeated' AND a.status IN ('wanted','owned') THEN 1 END)::INT AS can_receive,
    (COUNT(CASE WHEN a.status='repeated' AND b.status IN ('wanted','owned') THEN 1 END) +
     COUNT(CASE WHEN b.status='repeated' AND a.status IN ('wanted','owned') THEN 1 END))::INT AS match_score
  FROM user_stickers a
  JOIN user_stickers b ON a.sticker_id = b.sticker_id
  JOIN users u         ON b.user_id = u.id
  JOIN stickers s      ON a.sticker_id = s.id
  JOIN sections sec    ON s.section_id = sec.id
  WHERE a.user_id  = current_user_id
    AND b.user_id != current_user_id
    AND sec.album_id = album_id_filter
  GROUP BY u.id, u.username, u.display_name, u.avatar_url, u.city
  HAVING
    COUNT(CASE WHEN a.status='repeated' AND b.status IN ('wanted','owned') THEN 1 END) > 0
    OR
    COUNT(CASE WHEN b.status='repeated' AND a.status IN ('wanted','owned') THEN 1 END) > 0
  ORDER BY match_score DESC
  LIMIT 50;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Seguridad básica
-- ============================================================
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_matches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_messages ENABLE ROW LEVEL SECURITY;

-- Usuarios: cada quien lee su propio perfil; todos leen perfiles públicos
CREATE POLICY "users_read_own"   ON users FOR SELECT USING (true); -- perfiles son públicos
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Stickers del usuario: solo el dueño puede ver/editar los suyos
CREATE POLICY "user_stickers_own" ON user_stickers
  FOR ALL USING (auth.uid() = user_id);

-- Matches: los dos participantes pueden ver el match
CREATE POLICY "swap_matches_participants" ON swap_matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "swap_matches_create" ON swap_matches
  FOR INSERT WITH CHECK (auth.uid() = user_a_id);

-- Mensajes: los dos participantes del match pueden leer/escribir
CREATE POLICY "swap_messages_participants" ON swap_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM swap_matches m
      WHERE m.id = match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
    )
  );

CREATE POLICY "swap_messages_send" ON swap_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Albums y secciones son de lectura pública
ALTER TABLE albums   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "albums_public_read"   ON albums   FOR SELECT USING (true);
CREATE POLICY "sections_public_read" ON sections FOR SELECT USING (true);
CREATE POLICY "stickers_public_read" ON stickers FOR SELECT USING (true);
