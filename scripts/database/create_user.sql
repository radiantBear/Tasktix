CREATE TABLE user (
  `u_id` varchar(16) PRIMARY KEY,
  `u_username` varchar(32),
  `u_email` varchar(128),
  `u_password` varchar(256),
  `u_dateCreated` timestamp,
  `u_dateLogin` timestamp
)