CREATE TABLE IF NOT EXISTS `media` (
  `id`          BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id`     BIGINT NOT NULL,
  `media_type`  ENUM('IMAGE','VIDEO','DOCUMENT') NOT NULL,
  `url`         VARCHAR(255) NOT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  `mime_type`   VARCHAR(100) NOT NULL,

  INDEX `idx_media_post` (`post_id`),

  CONSTRAINT `fk_media_post`
    FOREIGN KEY (`post_id`)
    REFERENCES `post` (`id`)
    ON DELETE CASCADE
) ENGINE = InnoDB;