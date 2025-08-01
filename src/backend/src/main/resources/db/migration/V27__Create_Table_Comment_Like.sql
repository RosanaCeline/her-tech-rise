CREATE TABLE IF NOT EXISTS comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP,

  CONSTRAINT fk_comment_like_comment
    FOREIGN KEY (comment_id)
    REFERENCES post_comment (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comment_like_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);
