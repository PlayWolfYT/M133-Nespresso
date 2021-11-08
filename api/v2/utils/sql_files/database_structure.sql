CREATE TABLE IF NOT EXISTS
    `nespresso_user_roles` (
        `role_id` INT NOT NULL AUTO_INCREMENT,
        `role_name` VARCHAR(255) NOT NULL,
        `role_create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`role_id`)
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_users` ( 
        `user_id` INT NOT NULL AUTO_INCREMENT, 
        `user_name` VARCHAR(32) NOT NULL, 
        `user_role_id` INT NOT NULL, 
        `user_password_hash` VARCHAR(255), 
        `user_create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        `user_modify_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (`user_id`), 
    FOREIGN KEY(`user_role_id`) REFERENCES `nespresso_user_roles`(`role_id`) 
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_cup_sizes` ( 
        `cup_size_id` INT NOT NULL AUTO_INCREMENT, 
        `cup_size_name` VARCHAR(255) NOT NULL, 
        `cup_size_value` INT NOT NULL UNIQUE, 
        `cup_size_create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        `cup_size_modify_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    PRIMARY KEY (`cup_size_id`) 
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_cups` ( 
        `cup_id` VARCHAR(14) NOT NULL UNIQUE, 
        `cup_cup_size_id` INT NOT NULL, 
        `cup_user_id` INT NOT NULL, 
        `cup_create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        `cup_modify_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (`cup_cup_size_id`) REFERENCES `nespresso_cup_sizes`(`cup_size_id`), 
    PRIMARY KEY (`cup_id`) 
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_transactions` ( 
        `transaction_id` INT NOT NULL AUTO_INCREMENT, 
        `transaction_user_id` INT NOT NULL, 
        `transaction_amount` INT NOT NULL, 
        `transaction_create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (`transaction_user_id`) REFERENCES `nespresso_users`(`user_id`), 
    PRIMARY KEY (`transaction_id`) 
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_donations` ( 
        `donation_id` INT NOT NULL AUTO_INCREMENT, 
        `donation_from_user_id` INT NOT NULL, 
        `donation_to_user_id` INT NOT NULL, 
        `donation_message` VARCHAR(255), 
        `donation_used` BOOLEAN NOT NULL, 
        `donation_valid_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        `donation_create_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        `donation_modify_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (`donation_from_user_id`) REFERENCES `nespresso_users`(`user_id`), 
    FOREIGN KEY (`donation_to_user_id`) REFERENCES `nespresso_users`(`user_id`), 
    PRIMARY KEY (`donation_id`) 
);

CREATE TABLE IF NOT EXISTS 
    `nespresso_statistics` ( 
        `statistic_id` INT NOT NULL AUTO_INCREMENT, 
        `statistic_user_id` INT NOT NULL, 
        `statistic_cup_id` VARCHAR(14) NOT NULL, 
        `statistic_create_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (`statistic_user_id`) REFERENCES `nespresso_users`(`user_id`), 
    FOREIGN KEY (`statistic_cup_id`) REFERENCES `nespresso_cups`(`cup_id`), 
    PRIMARY KEY (`statistic_id`) 
);