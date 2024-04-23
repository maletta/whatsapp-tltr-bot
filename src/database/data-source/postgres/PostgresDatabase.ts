import { Pool, PoolClient, PoolConfig } from 'pg';

abstract class IDataBase<U> {
  abstract init(): Promise<U | void>;
  abstract transaction(callback: (client: U) => Promise<void>): Promise<void>;
  abstract connect(): Promise<U>;
}
class PostgresDatabase implements IDataBase<PoolClient> {
  private pool: Pool;

  constructor(poolConfig: PoolConfig) {
    this.pool = new Pool(poolConfig);
  }

  async init(): Promise<PoolClient | void> {
    return this.pool.connect().then((connection) => {
      console.log('Connected on postgres database');
      connection.release();
    });
  }

  async connect(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async transaction(
    callback: (client: PoolClient) => Promise<void>,
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await callback(client);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export { PostgresDatabase, IDataBase };
