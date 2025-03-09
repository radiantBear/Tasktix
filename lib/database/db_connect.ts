import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

async function connect(): Promise<mysql.Connection> {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  conn.config.namedPlaceholders = true;

  return conn;
}

export async function query<T extends RowDataPacket>(
  sql: string,
  values: any
): Promise<T[] | false> {
  let conn;

  try {
    conn = await connect();

    let result;
    if (values) [result] = await conn.query<T[]>(sql, values);
    else [result] = await conn.query<T[]>(sql);

    await conn.end();

    if (result.length) return result;

    return false;
  } catch (err) {
    /* Don't let ending the connection cause an error if it's having issues too */
    try {
      conn?.end();
    } catch (_) {}
    console.error(err);

    return false;
  }
}

export async function execute(
  sql: string,
  values: any
): Promise<ResultSetHeader | false> {
  let conn;

  try {
    conn = await connect();

    let result;
    if (values) [result] = await conn.execute<ResultSetHeader>(sql, values);
    else [result] = await conn.execute<ResultSetHeader>(sql);

    await conn.end();

    return result;
  } catch (err) {
    /* Don't let ending the connection cause an error if it's having issues too */
    try {
      conn?.end();
    } catch (_) {}
    console.error(err);

    return false;
  }
}
