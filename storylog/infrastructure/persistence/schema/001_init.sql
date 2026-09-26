DO $$
BEGIN
  CREATE TYPE media_type AS ENUM ('movie', 'series', 'book', 'game');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE user_media_status AS ENUM ('planned', 'in_progress', 'completed', 'dropped');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  display_name VARCHAR(128) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type media_type NOT NULL,
  release_date DATE,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_media (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  status user_media_status NOT NULL,
  thoughts TEXT,
  rating NUMERIC(2, 1),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, media_id),
  CONSTRAINT user_media_rating_range CHECK (
    rating IS NULL OR (rating >= 1 AND rating <= 5)
  )
);

CREATE INDEX IF NOT EXISTS media_type_idx ON media (type);
CREATE INDEX IF NOT EXISTS user_media_created_at_idx ON user_media (user_id, created_at DESC);
