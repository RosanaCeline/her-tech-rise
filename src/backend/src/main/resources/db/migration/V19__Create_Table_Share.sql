CREATE TABLE IF NOT EXISTS post_share (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  content VARCHAR(3000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_post_share_post
    FOREIGN KEY (post_id)
    REFERENCES post (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_post_share_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_post_share_post ON post_share (post_id);
CREATE INDEX idx_post_share_user ON post_share (user_id);