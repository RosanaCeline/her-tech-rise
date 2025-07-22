CREATE TABLE IF NOT EXISTS post_like (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (post_id, user_id),

  CONSTRAINT fk_post_like_post
    FOREIGN KEY (post_id)
    REFERENCES post (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_post_like_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_post_like_post ON post_like (post_id);
CREATE INDEX idx_post_like_user ON post_like (user_id);