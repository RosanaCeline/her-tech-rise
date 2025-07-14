CREATE TABLE IF NOT EXISTS `post` (
  `id`            BIGINT PRIMARY KEY AUTO_INCREMENT,
  `author_id`     BIGINT NOT NULL,
  `content`       VARCHAR(3000) NOT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `community_id`  BIGINT,
  `media_url`     VARCHAR(255),
  `deleted` BOOLEAN NOT NULL DEFAULT FALSE AFTER `media_url`,
  `visibility` ENUM('PUBLICO', 'PRIVADO') NOT NULL DEFAULT 'PUBLICO' AFTER `deleted`,
  `edited` BOOLEAN NOT NULL DEFAULT FALSE,
  `edited_at` DATETIME NULL,


  CONSTRAINT `chk_post_content_or_media`
    CHECK (LENGTH(`content`) > 0 OR `media_url` IS NOT NULL),

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