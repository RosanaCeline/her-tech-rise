CREATE TABLE IF NOT EXISTS `users` (
	`id` bigint PRIMARY KEY AUTO_INCREMENT,
	`name` varchar(150) NOT NULL,
	`email` varchar(255) UNIQUE NOT NULL,
	`password` varchar(255) NOT NULL,
	`phone_number` varchar(20) NOT NULL,
	`street` varchar(100) NOT NULL,
	`neighborhood` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`cep` varchar(9) NOT NULL,
	`type` enum('PROFESSIONAL', 'COMPANY') NOT NULL,
	`user_handle` varchar(15) UNIQUE NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`role_id` bigint NOT NULL,
     FOREIGN KEY (`role_id`) REFERENCES `role`(`id`),

	`account_non_expired` bit(1) NOT NULL DEFAULT 1, -- 1 = TRUE
	`account_non_locked` bit(1) NOT NULL DEFAULT 1,
	`credentials_non_expired` bit(1) NOT NULL DEFAULT 1,
	`enabled` bit(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;