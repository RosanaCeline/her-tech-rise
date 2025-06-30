CREATE TABLE IF NOT EXISTS permission (
	`id` bigint PRIMARY KEY AUTO_INCREMENT,
	`description` varchar(100) UNIQUE NOT NULL
) ENGINE=InnoDB;