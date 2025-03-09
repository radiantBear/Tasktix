'use server';

import User from '@/lib/model/user';
import { execute, query } from './db_connect';
import { DB_User, extractUserFromRow } from './model/user';

export async function createUser(user: User): Promise<boolean> {
  const sql = `
    INSERT INTO \`users\`(
      \`u_id\`,
      \`u_username\`,
      \`u_email\`,
      \`u_password\`,
      \`u_dateCreated\`,
      \`u_dateSignedIn\`
    )
    VALUES (:id, :username, :email, :password, :dateCreated, :dateSignedIn);
  `;

  const result = await execute(sql, user);

  if (!result) return false;

  return true;
}

export async function updateUser(user: User): Promise<boolean> {
  const sql = `
    UPDATE \`users\`
    SET 
      \`u_username\` = :username,
      \`u_email\` = :email,
      \`u_password\` = :password,
      \`u_dateSignedIn\` = :dateSignedIn
    WHERE \`u_id\` = :id;
  `;

  const result = await execute(sql, user);

  if (!result) return false;

  return true;
}

export async function getUserById(id: string): Promise<User | false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_id\` = :id;
  `;

  const result = await query<DB_User>(sql, { id });

  if (!result) return false;

  return extractUserFromRow(result[0]);
}

export async function getUserByUsername(
  username: string
): Promise<User | false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_username\` = :username;
  `;

  const result = await query<DB_User>(sql, { username });

  if (!result) return false;

  return extractUserFromRow(result[0]);
}

export async function getUserByEmail(email: string): Promise<User | false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_email\` = :email;
  `;

  const result = await query<DB_User>(sql, { email });

  if (!result) return false;

  return extractUserFromRow(result[0]);
}

export async function getUserBySessionId(id: string): Promise<User | false> {
  interface DB_Session extends DB_User {
    s_id: string;
    s_dateExpire: Date;
  }

  const sql = `
    SELECT * FROM \`users\`
      INNER JOIN \`sessions\` ON \`users\`.\`u_id\` = \`sessions\`.\`s_u_id\`
    WHERE \`s_id\` = :id;
  `;

  const result = await query<DB_Session>(sql, { id });

  if (!result) return false;

  if (result[0].s_dateExpire.getTime() < new Date().getTime()) return false;

  return extractUserFromRow(result[0]);
}
