import { Pool, PoolClient } from 'pg';
import { ENVIRONMENT } from '../constants';

class _Pool extends Pool {
  async transaction<R = void>(func: (client: PoolClient) => R) {
    const client = await this.connect();

    try {
      await client.query('BEGIN');
      const [response] = await Promise.all([func(client)]);
      await client.query('COMMIT');


      client.release();
      return response;
    } catch (e) {
      await client.query('ROLLBACK');
      client.release();

      console.error(e);
      throw new Error(e as string);
    }
  }
}

const connection = new _Pool({
  user: ENVIRONMENT.PGSQL_USER,
  password: ENVIRONMENT.PGSQL_PASSWORD,
  host: ENVIRONMENT.PGSQL_HOST,
  port: ENVIRONMENT.PGSQL_PORT,
  database: ENVIRONMENT.PGSQL_DATABASE,
});

export default connection;
