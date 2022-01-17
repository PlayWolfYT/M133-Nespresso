/** Cup Sizes **/
INSERT IGNORE INTO 
    `nespresso_cup_sizes` (
        `cup_size_id`, 
        `cup_size_name`, 
        `cup_size_value`
    ) 
    VALUES 
        (1, 'UNKNOWN', 0), 
        (2, 'ESPRESSO', 1), 
        (3, 'LUNGO', 2)
;


/** User Roles **/
INSERT IGNORE INTO 
    `nespresso_user_roles` (
        `role_id`, 
        `role_name` 
    ) 
    VALUES 
        (1, 'Administrator'), 
        (2, 'Benutzer')
;

/** Users **/
INSERT IGNORE INTO 
    `nespresso_users` (
        `user_id`, 
        `user_name`, 
        `user_role_id`
    ) 
    VALUES 
        (1, 'SYSTEM', 1)
;