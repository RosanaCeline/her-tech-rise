CREATE TABLE IF NOT EXISTS `post` (
  `id`            BIGINT PRIMARY KEY AUTO_INCREMENT,
  `author_id`     BIGINT NOT NULL,
  `content`       VARCHAR(3000),
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `community_id`  BIGINT,
  `deleted`       BOOLEAN NOT NULL DEFAULT FALSE,
  `visibility`    ENUM('PUBLICO', 'PRIVADO') NOT NULL DEFAULT 'PUBLICO',
  `edited`        BOOLEAN NOT NULL DEFAULT FALSE,
  `edited_at`     DATETIME NULL,

  INDEX `idx_post_author`    (`author_id`),
  INDEX `idx_post_community` (`community_id`),
  INDEX `idx_post_created`   (`created_at`),

  CONSTRAINT `fk_post_author`
    FOREIGN KEY (`author_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `fk_post_community`
    FOREIGN KEY (`community_id`)
    REFERENCES `community` (`id`)
    ON DELETE SET NULL
) ENGINE = InnoDB;