'use server';

import User from '@/lib/model/user';
import { RowDataPacket } from 'mysql2/promise'
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
    INSERT INTO \`user\`(
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

export async function getUserById(id: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`user\`
    WHERE \`u_id\` = :id
  `;
  
  const result = await query<DB_User>(sql, { id });
  
  if(!result)
    return false;

  return extractUserFromRow(result[0]);
}

export async function getUserByUsername(username: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`user\`
    WHERE \`u_username\` = :username
  `;
  
  const result = await query<DB_User>(sql, { username });
    
  if(!result)
    return false;

  return extractUserFromRow(result[0]);
  
}

export async function getUserByEmail(email: string): Promise<User|false> {
  const sql = `
    SELECT * FROM \`user\`
    WHERE \`u_email\` = :email
  `;
  
  const result = await query<DB_User>(sql, { email });
  
  if(!result)
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