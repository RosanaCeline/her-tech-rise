ALTER TABLE post_comment
ADD COLUMN share_id BIGINT;

CREATE INDEX idx_post_comment_share ON post_comment (share_id);

ALTER TABLE post_comment
ADD CONSTRAINT fk_post_comment_share
FOREIGN KEY (share_id)
REFERENCES post_share (id)
ON DELETE CASCADE;
