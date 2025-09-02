CREATE TABLE `users` (
  `u_id` char(16) NOT NULL PRIMARY KEY,
  `u_username` varchar(32) NOT NULL,
  `u_email` varchar(128) NOT NULL,
  -- TODO: password really should be fixed-width because all hashes are the same length
  `u_password` varchar(256) NOT NULL,
  `u_color` ENUM ('Pink', 'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Cyan', 'Blue', 'Violet') NOT NULL,
  `u_dateCreated` datetime NOT NULL,
  `u_dateSignedIn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `sessions` (
  `s_id` char(128) NOT NULL PRIMARY KEY,
  `s_u_id` char(16) NOT NULL,
  `s_dateExpire` datetime NOT NULL,
  FOREIGN KEY (`s_u_id`) REFERENCES `users` (`u_id`)
    ON DELETE CASCADE
);

CREATE TABLE `lists` (
  `l_id` char(16) NOT NULL PRIMARY KEY,
  `l_name` varchar(64) NOT NULL,
  `l_color` ENUM ('Pink','Red','Orange','Amber','Yellow','Lime','Green','Emerald','Cyan','Blue','Violet') NOT NULL,
  `l_description` text NULL DEFAULT NULL,
  `l_hasTimeTracking` boolean NOT NULL DEFAULT TRUE,
  `l_hasDueDates` boolean NOT NULL DEFAULT TRUE,
  `l_isAutoOrdered` boolean NOT NULL DEFAULT TRUE
);

CREATE TABLE `listSections` (
  `ls_id` char(16) NOT NULL PRIMARY KEY,
  `ls_l_id` char(16) NOT NULL,
  `ls_name` varchar(64) NOT NULL,
  FOREIGN KEY (`ls_l_id`) REFERENCES `lists` (`l_id`)
    ON DELETE CASCADE
);

CREATE TABLE `items` (
  `i_id` char(16) NOT NULL PRIMARY KEY,
  `i_name` varchar(128) NOT NULL,
  `i_status` ENUM ('Unstarted', 'In Progress', 'Paused', 'Completed') NOT NULL DEFAULT 'Unstarted',
  `i_priority` ENUM ('High', 'Medium', 'Low')  NOT NULL DEFAULT 'Low',
  `i_isUnclear` boolean NOT NULL DEFAULT 0,
  `i_expectedMs` integer NULL DEFAULT NULL,
  `i_elapsedMs` integer NOT NULL DEFAULT 0,
  `i_parentId` char(16) NULL DEFAULT NULL,
  `i_ls_id` char(16) NOT NULL,
  `i_sectionIndex` integer NOT NULL DEFAULT 0,
  `i_dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `i_dateDue` datetime NULL DEFAULT NULL,
  `i_dateStarted` datetime NULL DEFAULT NULL,
  `i_dateCompleted` datetime NULL DEFAULT NULL,
  FOREIGN KEY (`i_parentId`) REFERENCES `items` (`i_id`)
    ON DELETE CASCADE,
  FOREIGN KEY (`i_ls_id`) REFERENCES `listSections` (`ls_id`)
    ON DELETE CASCADE
);

CREATE TABLE `tags` (
  `t_id` char(16) NOT NULL PRIMARY KEY,
  `t_name` varchar(32) NOT NULL,
  `t_color` ENUM ('Pink', 'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Cyan', 'Blue', 'Violet') NOT NULL,
  `t_l_id` char(16) NOT NULL,
  FOREIGN KEY (`t_l_id`) REFERENCES `lists` (`l_id`)
    ON DELETE CASCADE
);

CREATE TABLE `itemTags` (
  `it_i_id` char(16) NOT NULL,
  `it_t_id` char(16) NOT NULL,
  PRIMARY KEY (`it_i_id`, `it_t_id`),
  FOREIGN KEY (`it_i_id`) REFERENCES `items` (`i_id`)
    ON DELETE CASCADE,
  FOREIGN KEY (`it_t_id`) REFERENCES `tags` (`t_id`)
    ON DELETE CASCADE
);

CREATE TABLE `listMembers` (
  `lm_u_id` char(16) NOT NULL,
  `lm_l_id` char(16) NOT NULL,
  `lm_canAdd` boolean NOT NULL DEFAULT 0,
  `lm_canRemove` boolean NOT NULL DEFAULT 0,
  `lm_canComplete` boolean NOT NULL DEFAULT 0,
  `lm_canAssign` boolean NOT NULL DEFAULT 0,
  PRIMARY KEY (`lm_u_id`, `lm_l_id`),
  FOREIGN KEY (`lm_u_id`) REFERENCES `users` (`u_id`)
    ON DELETE CASCADE,
  FOREIGN KEY (`lm_l_id`) REFERENCES `lists` (`l_id`)
    ON DELETE CASCADE
);

CREATE TABLE `itemAssignees` (
  `ia_u_id` char(16) NOT NULL,
  `ia_i_id` char(16) NOT NULL,
  `ia_role` varchar(64) NOT NULL,
  PRIMARY KEY (`ia_u_id`, `ia_i_id`),
  FOREIGN KEY (`ia_u_id`) REFERENCES `users` (`u_id`)
    ON DELETE CASCADE,
  FOREIGN KEY (`ia_i_id`) REFERENCES `items` (`i_id`)
    ON DELETE CASCADE
);