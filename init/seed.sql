-- Create user table
CREATE TABLE `task_management`.`user` (
  `user_id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `first_name` VARCHAR(300) NOT NULL,
  `last_name` VARCHAR(300) NOT NULL,
  `role` ENUM('manager', 'technician') NOT NULL DEFAULT 'technician',
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`user_id`));

-- Create maintenance_task tableuseruser
CREATE TABLE `task_management`.`task` (
  `task_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(300) NOT NULL,
  `status` ENUM('new', 'in progress', 'complete') NOT NULL DEFAULT 'new',
  `summary` VARCHAR(2500) NULL,
  `created_by` VARCHAR(36) NOT NULL,
  `performed_at` TIMESTAMP NULL,
  `completed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT NOW(),
	FOREIGN KEY (created_by)
		REFERENCES user(user_id),


-- Populate users for the app
INSERT INTO user
  (user_id, username, password, first_name, last_name, role)
VALUES
  ('0754fa93-efc5-11ed-8281-4b0432ed118d', 'jimmyj', '$2y$10$PqXh89Hrdg.RUucZoSqzduhO4vlH0CaXtoSiRYd5zjk4.ZzJnQS0W', 'Jimmy', 'J', 'technician'),
  ('0754fa94-efc5-11ed-8281-4b0432ed118d', 'yvonnel', '$2y$10$PqXh89Hrdg.RUucZoSqzduhO4vlH0CaXtoSiRYd5zjk4.ZzJnQS0W', 'Yvonne', 'L', 'manager'),
  ('0754fa95-efc5-11ed-8281-4b0432ed118d', 'randallh', '$2y$10$7qThI7FlUxu4ukBlgf1qMOBrTzIgHcgTEjJPa.S9jnuaFdT1DIOHG', 'Randall', 'H', 'technician'),
  ('0754fa96-efc5-11ed-8281-4b0432ed118d', 'johndoe', '$2y$10$7qThI7FlUxu4ukBlgf1qMOBrTzIgHcgTEjJPa.S9jnuaFdT1DIOHG', 'John', 'Doe', 'technician'),
  ('0754fa97-efc5-11ed-8281-4b0432ed118d', 'janedoe', '$2y$10$L18RWaeKjdMqlL.1s80wmuNfkr2Sih9qH3mb8Osll.W64VUv36LhK', 'Jane', 'Doe', 'technician'),
  ('0754fa98-efc5-11ed-8281-4b0432ed118d', 'leahl', '$2y$10$L18RWaeKjdMqlL.1s80wmuNfkr2Sih9qH3mb8Osll.W64VUv36LhK', 'Leah', 'L', 'technician');

-- Populate tasks
INSERT INTO task
  (task_id, name, status, summary, created_by)
VALUES
  (UUID(), 'Repair bedroom AC', 'new', 'Change AC filter', '0754fa95-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Repair bathroom sink', 'new', 'Add sealant', '0754fa95-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Repair smoke detector', 'new', 'Change battery', '0754fa98-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Install walkway lamps', 'new', 'Install motion-sensored walkway lamps', '0754fa96-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Install watering system for the grass', 'new', 'Install auto-watering system for the frontyard', '0754fa96-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Change LED UV bulbs', 'new', 'Change LED UV light bulbs for the plants', '0754fa96-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Install badet', 'new', 'Install Japanese high-tech badet in the bathroom', '0754fa95-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Set up Wifi', 'new', 'Set up Wifi for Apt 15A', '0754fa97-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Inspect dryer ducts', 'new', 'Inspect dryer ducts for the building', '0754fa97-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Swap out AC unit', 'new', 'Swap out AC unit for Apt 10F', '0754fa96-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Reset fob key readers', 'new', 'Reset fob key readers on all entrances', '0754fa96-efc5-11ed-8281-4b0432ed118d'),
  (UUID(), 'Inspect water filteration system', 'new', 'Inspect water filteration system', '0754fa93-efc5-11ed-8281-4b0432ed118d');
