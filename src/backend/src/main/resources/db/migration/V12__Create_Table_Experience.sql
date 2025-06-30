CREATE TABLE IF NOT EXISTS `experience` (
	`id` bigint PRIMARY KEY AUTO_INCREMENT,
	`title` varchar(100) NOT NULL,
	`company` varchar(150) NOT NULL,
	`modality` varchar(30) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date,
	`is_current` boolean NOT NULL DEFAULT FALSE,
	`description` varchar(1000),
	`professional_id` bigint,
	CONSTRAINT fk_experience_professional FOREIGN KEY (`professional_id`) REFERENCES `professional`(`user_id`)
) ENGINE=InnoDB;