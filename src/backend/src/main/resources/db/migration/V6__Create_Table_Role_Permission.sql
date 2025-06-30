CREATE TABLE IF NOT EXISTS role_permission (
	`role_id` BIGINT NOT NULL,
	`permission_id` BIGINT NOT NULL,
	PRIMARY KEY (`role_id`, `permission_id`),
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`),
	FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`)
) ENGINE=InnoDB;