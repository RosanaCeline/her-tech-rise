CREATE TABLE IF NOT EXISTS media (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL,
  media_type VARCHAR(10) NOT NULL
    CHECK (media_type IN ('IMAGE','VIDEO','DOCUMENT')),
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mime_type VARCHAR(100) NOT NULL,

  CONSTRAINT fk_media_post
    FOREIGN KEY (post_id)
    REFERENCES post (id)
    ON DELETE CASCADE
);

CREATE INDEX idx_media_post ON media (post_id);