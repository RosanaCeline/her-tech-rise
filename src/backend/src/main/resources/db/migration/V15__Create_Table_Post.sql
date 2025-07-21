CREATE TABLE IF NOT EXISTS post (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL,
  content VARCHAR(3000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  community_id BIGINT,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  visibility VARCHAR(10) NOT NULL DEFAULT 'PUBLICO'
    CHECK (visibility IN ('PUBLICO', 'PRIVADO')),
  edited BOOLEAN NOT NULL DEFAULT FALSE,
  edited_at TIMESTAMPTZ NULL,

  CONSTRAINT fk_post_author
    FOREIGN KEY (author_id)
    REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_post_community
    FOREIGN KEY (community_id)
    REFERENCES community (id)
    ON DELETE SET NULL
);

CREATE INDEX idx_post_author ON post (author_id);
CREATE INDEX idx_post_community ON post (community_id);
CREATE INDEX idx_post_created ON post (created_at);