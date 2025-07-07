CREATE TABLE IF NOT EXISTS `company` (
  `user_id` BIGINT PRIMARY KEY,
  `cnpj` VARCHAR(18) UNIQUE NOT NULL,
  `company_type` ENUM('NACIONAL', 'INTERNACIONAL') NOT NULL,
  `description` VARCHAR(400),
  `about_us` VARCHAR(1000),
  CONSTRAINT fk_company_user FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB;