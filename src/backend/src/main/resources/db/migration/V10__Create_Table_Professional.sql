CREATE TABLE IF NOT EXISTS `professional` (
    `user_id` BIGINT PRIMARY KEY,
    `cpf` VARCHAR(14) UNIQUE NOT NULL,
    `birth_date` DATE NOT NULL,
    `technology` VARCHAR(80),
    `biography` VARCHAR(1000),
    `external_link` VARCHAR(100),
    CONSTRAINT fk_prof_user FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
)  ENGINE=INNODB;