CREATE TABLE IF NOT EXISTS `follow_relationship` (
  `id`            BIGINT PRIMARY KEY AUTO_INCREMENT,
  `follower_id`   BIGINT NOT NULL,
  `following_id`  BIGINT NOT NULL,
  `followed_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY `uk_follow_pair` (`follower_id`, `following_id`),
  INDEX `idx_follower`  (`follower_id`),
  INDEX `idx_following` (`following_id`),

  CONSTRAINT `fk_follow_follower`
    FOREIGN KEY (`follower_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_follow_following`
    FOREIGN KEY (`following_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `chk_no_self_follow`
    CHECK (`follower_id` <> `following_id`)
) ENGINE = InnoDB;
