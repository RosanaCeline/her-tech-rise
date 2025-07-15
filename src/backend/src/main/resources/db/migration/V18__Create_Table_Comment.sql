CREATE TABLE IF NOT EXISTS `post_comment` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `content` VARCHAR(3000) NOT NULL,
  `parent_comment_id` BIGINT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `edited` BOOLEAN NOT NULL DEFAULT FALSE,
  `edited_at` DATETIME NULL,

  INDEX `idx_post_comment_post` (`post_id`),
  INDEX `idx_post_comment_user` (`user_id`),
  INDEX `idx_post_comment_parent` (`parent_comment_id`),

  CONSTRAINT `fk_post_comment_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `post` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_post_comment_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_post_comment_parent`
    FOREIGN KEY (`parent_comment_id`)
    REFERENCES `post_comment` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB;