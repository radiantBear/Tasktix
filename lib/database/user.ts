'use server';

import User from '@/lib/model/user';
import { RowDataPacket } from 'mysql2/promise';
import { execute, query } from './db_connect';

interface DB_User extends RowDataPacket {
  u_id: string;
  u_username: string;
  u_email: string;
  u_password: string;
  u_dateCreated: Date;
  u_dateLogin: Date;
}

export async function createUser(user: User): Promise<boolean> {
  const sql = `
    INSERT INTO \`users\`(
      \`u_id\`,
      \`u_username\`,
      \`u_email\`,
      \`u_password\`,
      \`u_dateCreated\`,
      \`u_dateLogin\`
    )
    VALUES (:id, :username, :email, :password, :dateCreated, :dateLogin);
  `;
  
  const result = await execute(sql, user);
  
  if(!result)
    return false;
  
  return true;
}

export async function updateUser(user: User): Promise<boolean> {
  const sql = `
    UPDATE \`users\`
    SET 
      \`u_username\` = :username,
      \`u_email\` = :email,
      \`u_password\` = :password,
      \`u_dateLogin\` = :dateLogin
    WHERE \`u_id\` = :id;
  `;
  
  const result = await execute(sql, user);
  
  if(!result)
    return false;
  
  return true;
}

export async function getUserById(id: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_id\` = :id
  `;
  
  const result = await query<DB_User>(sql, { id });
  
  if(!result)
    return false;

  return extractUserFromRow(result[0]);
}

export async function getUserByUsername(username: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_username\` = :username
  `;
  
  const result = await query<DB_User>(sql, { username });
    
  if(!result)
    return false;

  return extractUserFromRow(result[0]);
  
}

export async function getUserByEmail(email: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`users\`
    WHERE \`u_email\` = :email
  `;
  
  const result = await query<DB_User>(sql, { email });
  
  if(!result)
    return false;

  return extractUserFromRow(result[0]);
}

export async function getUserBySessionId(id: string): Promise<User|false> {
  interface DB_Session extends DB_User {
    s_id: string;
    s_dateExpire: Date;
  }
  
  const sql = `
    SELECT * FROM \`users\`
      INNER JOIN \`sessions\` ON \`users\`.\`u_id\` = \`sessions\`.\`s_u_id\`
    WHERE \`s_id\` = :id
  `;
  
  const result = await query<DB_Session>(sql, { id });
  
  if(!result)
    return false;

  if(result[0].s_dateExpire.getTime() < (new Date()).getTime())
    return false;

  return extractUserFromRow(result[0]);
}

function extractUserFromRow(row: DB_User): User {
  const user = new User(row.u_id);
  user.username = row.u_username;
  user.email = row.u_email;
  user.password = row.u_password;
  user.dateCreated = new Date(row.u_dateCreated);
  
  if(row.u_dateLogin)
    user.dateLogin = new Date(row.u_dateLogin);

  return user;
}