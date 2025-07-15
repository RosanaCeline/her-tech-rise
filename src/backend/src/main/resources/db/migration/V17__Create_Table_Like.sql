CREATE TABLE IF NOT EXISTS `post_like` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY `uniq_post_user` (`post_id`, `user_id`),

  INDEX `idx_post_like_post` (`post_id`),
  INDEX `idx_post_like_user` (`user_id`),

  CONSTRAINT `fk_post_like_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `post` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_post_like_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB;