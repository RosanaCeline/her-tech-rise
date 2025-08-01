ALTER TABLE post_like
  ALTER COLUMN post_id DROP NOT NULL;

ALTER TABLE post_like
  ALTER COLUMN share_id DROP NOT NULL;

ALTER TABLE post_like
  ADD CONSTRAINT post_like_check
  CHECK (
    (post_id IS NOT NULL AND share_id IS NULL) OR
    (post_id IS NULL AND share_id IS NOT NULL)
  );
