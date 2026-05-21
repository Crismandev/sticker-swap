-- Fix the find_matches function to run with SECURITY DEFINER so that it bypasses RLS on user_stickers table
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
SECURITY DEFINER  -- Allows the function to bypass RLS policies on user_stickers table
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
