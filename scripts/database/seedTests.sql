INSERT INTO `users` (
  `u_id`,
  `u_username`,
  `u_email`,
  `u_password`,
  `u_color`,
  `u_dateCreated`,
  `u_dateSignedIn`
) 
VALUES (
  'testuser00000000',
  'newUser',
  'newUser@example.com',
  -- Hash below is for password "password123" --
  '8dcc5151672288af017bdd9a287e2cfc:pVSn7w5XhzLUSzk9nskA7rSkT5MlCWx5rfjCs4p0XIRUcNJgGZ+ZjFTvlYvcFlstroWanjifTBkI3C3IEuYKfcGPRujnH8ZQIojBCl3epqpO6bI0gIh4hxv2Pm5lfxce6nnhbnu6kZl7zvFqKFHL6wQH98KzI6AHKizXJcR4y+k=',
  'Blue',
  '2024-01-01 07:13:02',
  '2024-01-01 07:13:02'
), (
  'testuser00000001',
  'individualUser',
  'individualUser@example.com',
  -- Hash below is for password "5up2r_s3cr3t" --
  '932ef89377e9110209432c983e5a4f68:E2bM0eP608ovaC5yKAjGNGKxcBStUDms2ChxkFZl06S8Jz2OOdAAFss0UevLdddlo4cRwhR+xj/dWeLn0q8ZkMfdYNz8ugB6oFuJEkgYq0tJrl/n/CK1Pcc4/dNB2tOr7JI5SzH47wgITtWeW7aCNv4x7W2c/NA6SpKSDBeCjVQ=',
  'Yellow',
  '2023-02-14 09:05:53',
  '2024-01-02 14:37:28'
);
