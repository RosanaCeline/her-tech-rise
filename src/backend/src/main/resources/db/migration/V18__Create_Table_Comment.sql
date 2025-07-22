CREATE TABLE IF NOT EXISTS post_comment (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  content VARCHAR(3000) NOT NULL,
  parent_comment_id BIGINT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited BOOLEAN NOT NULL DEFAULT FALSE,
  edited_at TIMESTAMPTZ NULL,

  CONSTRAINT fk_post_comment_post
    FOREIGN KEY (post_id)
    REFERENCES post (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_post_comment_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_post_comment_parent
    FOREIGN KEY (parent_comment_id)
    REFERENCES post_comment (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_post_comment_post ON post_comment (post_id);
CREATE INDEX idx_post_comment_user ON post_comment (user_id);
CREATE INDEX idx_post_comment_parent ON post_comment (parent_comment_id);