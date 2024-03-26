CREATE TABLE `users` (
  `u_id` char(16) NOT NULL PRIMARY KEY,
  `u_username` varchar(32) NOT NULL,
  `u_email` varchar(128) NOT NULL,
  `u_password` varchar(256) NOT NULL,
  `u_dateCreated` datetime NOT NULL,
  `u_dateLogin` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `sessions` (
  `s_id` char(128) NOT NULL PRIMARY KEY,
  `s_u_id` char(16) NOT NULL,
  `s_dateExpire` datetime NOT NULL,
  FOREIGN KEY (`s_u_id`) REFERENCES `users` (`u_id`)
);

CREATE TABLE `lists` (
  `l_id` char(16) NOT NULL PRIMARY KEY,
  `l_name` varchar(64) NOT NULL,
  `l_description` text NULL DEFAULT NULL
);

CREATE TABLE `items` (
  `i_id` char(16) NOT NULL PRIMARY KEY,
  `i_name` varchar(128) NOT NULL,
  `i_status` ENUM ('Unstarted', 'In Progress', 'Needs Clarification', 'Completed') NOT NULL DEFAULT 'Unstarted',
  `i_importance` ENUM ('Urgent', 'High', 'Medium', 'Low', 'Unassigned')  NOT NULL DEFAULT 'Unassigned',
  `i_expectedDuration` time NOT NULL,
  `i_elapsedDuration` time NOT NULL DEFAULT '00:00:00',
  `i_parentId` char(16) NOT NULL,
  `i_l_id` char(16) NOT NULL,
  `i_dateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `i_dateDue` datetime NOT NULL,
  FOREIGN KEY (`i_parentId`) REFERENCES `items` (`i_id`),
  FOREIGN KEY (`i_l_id`) REFERENCES `lists` (`l_id`)
);

CREATE TABLE `tags` (
  `t_id` char(16) NOT NULL PRIMARY KEY,
  `t_name` varchar(32) NOT NULL,
  `t_color` ENUM ('Pink', 'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Cyan', 'Blue', 'Violet') NOT NULL,
  `t_i_id` char(16) NOT NULL,
  FOREIGN KEY (`t_i_id`) REFERENCES `items` (`i_id`)
);

CREATE TABLE `listMembers` (
  `lm_u_id` char(16) NOT NULL,
  `lm_l_id` char(16) NOT NULL,
  `lm_canAdd` boolean NOT NULL DEFAULT 0,
  `lm_canRemove` boolean NOT NULL DEFAULT 0,
  `lm_canComplete` boolean NOT NULL DEFAULT 0,
  `lm_canAssign` boolean NOT NULL DEFAULT 0,
  PRIMARY KEY (`lm_u_id`, `lm_l_id`),
  FOREIGN KEY (`lm_u_id`) REFERENCES `users` (`u_id`),
  FOREIGN KEY (`lm_l_id`) REFERENCES `lists` (`l_id`)
);

CREATE TABLE `itemAssignees` (
  `lm_u_id` char(16) NOT NULL,
  `lm_i_id` char(16) NOT NULL,
  `lm_role` varchar(64) NOT NULL,
  `lm_color` ENUM ('Pink', 'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Cyan', 'Blue', 'Violet') NOT NULL,
  PRIMARY KEY (`lm_u_id`, `lm_i_id`),
  FOREIGN KEY (`lm_u_id`) REFERENCES `users` (`u_id`),
  FOREIGN KEY (`lm_i_id`) REFERENCES `items` (`i_id`)
);