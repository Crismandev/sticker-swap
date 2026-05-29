-- Optimize find_matches to not require explicit 'wanted' rows in the database
-- If a user has no row for a sticker, it defaults to missing (wanted)
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
SECURITY DEFINER -- Runs as admin to bypass RLS
AS $$
  WITH all_stickers AS (
    -- Get all sticker IDs in this album
    SELECT s.id AS sticker_id 
    FROM stickers s
    JOIN sections sec ON s.section_id = sec.id
    WHERE sec.album_id = album_id_filter
  ),
  my_stickers AS (
    -- My stickers and their status
    SELECT sticker_id, status 
    FROM user_stickers 
    WHERE user_id = current_user_id
  ),
  other_stickers AS (
    -- Other users' stickers and their status
    SELECT us.user_id, us.sticker_id, us.status 
    FROM user_stickers us
    WHERE us.user_id != current_user_id
  ),
  my_repeated AS (
    -- Stickers I can give (my repeated)
    SELECT sticker_id FROM my_stickers WHERE status = 'repeated'
  ),
  other_repeated AS (
    -- Stickers other users have repeated
    SELECT user_id, sticker_id FROM other_stickers WHERE status = 'repeated'
  ),
  my_owned_or_repeated AS (
    -- Stickers I already have
    SELECT sticker_id FROM my_stickers WHERE status IN ('owned', 'repeated')
  ),
  other_owned_or_repeated AS (
    -- Stickers other users already have
    SELECT user_id, sticker_id FROM other_stickers WHERE status IN ('owned', 'repeated')
  )
  
  SELECT 
    u.id AS user_id,
    u.username,
    u.display_name,
    u.avatar_url,
    u.city,
    -- I can give them if I have repeated AND they don't have it owned or repeated
    COALESCE(COUNT(DISTINCT CASE WHEN mr.sticker_id IS NOT NULL AND oor.sticker_id IS NULL THEN mr.sticker_id END), 0)::INT AS can_give,
    -- I can receive from them if they have repeated AND I don't have it owned or repeated
    COALESCE(COUNT(DISTINCT CASE WHEN orp.sticker_id IS NOT NULL AND mor.sticker_id IS NULL THEN orp.sticker_id END), 0)::INT AS can_receive,
    -- Total match score
    (COALESCE(COUNT(DISTINCT CASE WHEN mr.sticker_id IS NOT NULL AND oor.sticker_id IS NULL THEN mr.sticker_id END), 0) +
     COALESCE(COUNT(DISTINCT CASE WHEN orp.sticker_id IS NOT NULL AND mor.sticker_id IS NULL THEN orp.sticker_id END), 0))::INT AS match_score
  FROM users u
  -- Join other users' repeated
  LEFT JOIN other_repeated orp ON u.id = orp.user_id
  LEFT JOIN my_owned_or_repeated mor ON orp.sticker_id = mor.sticker_id
  -- Join my repeated to check if other users need them
  LEFT JOIN my_repeated mr ON 1=1
  LEFT JOIN other_owned_or_repeated oor ON u.id = oor.user_id AND mr.sticker_id = oor.sticker_id
  -- Only include users in the album who have at least 1 match
  WHERE u.id != current_user_id
  GROUP BY u.id, u.username, u.display_name, u.avatar_url, u.city
  HAVING 
    (COALESCE(COUNT(DISTINCT CASE WHEN mr.sticker_id IS NOT NULL AND oor.sticker_id IS NULL THEN mr.sticker_id END), 0) > 0)
    OR
    (COALESCE(COUNT(DISTINCT CASE WHEN orp.sticker_id IS NOT NULL AND mor.sticker_id IS NULL THEN orp.sticker_id END), 0) > 0)
  ORDER BY match_score DESC
  LIMIT 50;
$$;
