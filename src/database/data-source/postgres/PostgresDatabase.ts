import { Pool, PoolClient, PoolConfig } from 'pg';
import { IDatabase } from '../IDataBase';

class PostgresDatabase implements IDatabase<Pool, PoolClient> {
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

  async connect(): Promise<void> {
    await this.pool.connect();
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  async query(text: string, params: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
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

export { PostgresDatabase };
