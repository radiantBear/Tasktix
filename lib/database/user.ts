'use server';

import User from '@/lib/model/user';
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

interface DB_User extends RowDataPacket {
  u_id: string;
  u_username: string;
  u_email: string;
  u_password: string;
  u_dateCreated: Date;
  u_dateLogin: Date;
}

export async function createUser(user: User): Promise<boolean> {
  try
  {
    const conn = await mysql.createConnection({
      user     : 'root',
      host     : 'localhost',
      password : 'db-password',
      database : 'todo'
    });

    const sql = `
      INSERT INTO \`user\`(
        \`u_id\`,
        \`u_username\`,
        \`u_email\`,
        \`u_password\`,
        \`u_dateCreated\`,
        \`u_dateLogin\`
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      );
    `;
    const params = [
      user.id,
      user.username,
      user.email,
      user.password,
      user.dateCreated,
      user.dateLogin
    ];

    await conn.execute<ResultSetHeader>(sql, params);
    await conn.end();
    
    return true;
  }
  catch(err) 
  {
    return false;
  }
}

export async function getUserById(id: string): Promise<User|false> {
  try 
  {
    const conn = await mysql.createConnection({
      user     : 'root',
      host     : 'localhost',
      password : 'db-password',
      database : 'todo'
    });

    const sql = `
      SELECT * FROM \`user\`
      WHERE \`u_id\` = ?
    `;
    const params = [id];

    const [ result ] = await conn.query<DB_User[]>(sql, params);
    await conn.end();
    
    return ExtractUserFromRow(result[0]);
  } 
  catch(err:any) 
  {
    return false;
  }
}

export async function getUserByUsername(username: string): Promise<User|false> {
  try 
  {
    const conn = await mysql.createConnection({
      user     : 'root',
      host     : 'localhost',
      password : 'db-password',
      database : 'todo'
    });

    const sql = `
      SELECT * FROM \`user\`
      WHERE \`u_username\` = ?
    `;
    const params = [username];

    const [ result ] = await conn.query<DB_User[]>(sql, params);
    await conn.end();
    
    return ExtractUserFromRow(result[0]);
  } 
  catch(err:any) 
  {
    return false;
  }
}

export async function getUserByEmail(email: string): Promise<User|false> {
  try 
  {
    const conn = await mysql.createConnection({
      user     : 'root',
      host     : 'localhost',
      password : 'db-password',
      database : 'todo'
    });

    const sql = `
      SELECT * FROM \`user\`
      WHERE \`u_email\` = ?
    `;
    const params = [email];

    const [ result ] = await conn.query<DB_User[]>(sql, params);
    await conn.end();
    
    return ExtractUserFromRow(result[0]);
  } 
  catch(err:any) 
  {
    return false;
  }
}

function ExtractUserFromRow(row: DB_User): User {
  const user = new User(row.u_id);
  user.username = row.u_username;
  user.email = row.u_email;
  user.password = row.u_password;
  user.dateCreated = new Date(row.u_dateCreated);
  
  if(row.u_dateLogin)
    user.dateLogin = new Date(row.u_dateLogin);

  return user;
}