CREATE TABLE IF NOT EXISTS follow_relationship (
  id BIGSERIAL PRIMARY KEY,
  follower_id BIGINT NOT NULL,
  following_id BIGINT NOT NULL,
  followed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (follower_id, following_id),

  CONSTRAINT fk_follow_follower
    FOREIGN KEY (follower_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_follow_following
    FOREIGN KEY (following_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT chk_no_self_follow
    CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follower ON follow_relationship (follower_id);
CREATE INDEX idx_following ON follow_relationship (following_id);