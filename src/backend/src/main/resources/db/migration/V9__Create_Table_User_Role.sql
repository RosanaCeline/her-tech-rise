CREATE TABLE IF NOT EXISTS user_role (
	`user_id` BIGINT NOT NULL,
	`role_id` BIGINT NOT NULL,
	PRIMARY KEY (`user_id`, `role_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)
) ENGINE=InnoDB;