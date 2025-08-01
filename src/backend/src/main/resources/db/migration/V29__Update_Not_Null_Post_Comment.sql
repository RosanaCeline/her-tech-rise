ALTER TABLE post_comment
  ALTER COLUMN post_id DROP NOT NULL;

ALTER TABLE post_comment
  ALTER COLUMN share_id DROP NOT NULL;

ALTER TABLE post_comment
  ADD CONSTRAINT post_comment_check
  CHECK (
    (post_id IS NOT NULL AND share_id IS NULL) OR
    (post_id IS NULL AND share_id IS NOT NULL)
  );
