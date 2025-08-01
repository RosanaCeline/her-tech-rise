ALTER TABLE post_like
ADD COLUMN IF NOT EXISTS share_id BIGINT;

ALTER TABLE post_like
ADD CONSTRAINT fk_post_like_share
FOREIGN KEY (share_id)
REFERENCES post_share (id)
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_post_like_share ON post_like (share_id);

ALTER TABLE post_like DROP CONSTRAINT post_like_post_id_user_id_key;

ALTER TABLE post_like
ADD CONSTRAINT unique_post_like UNIQUE (post_id, user_id),
ADD CONSTRAINT unique_share_like UNIQUE (share_id, user_id);