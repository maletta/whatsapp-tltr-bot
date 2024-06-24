import { inject, injectable } from 'tsyringe';
import { IDataBase } from './PostgresDatabase';
import { PoolClient } from 'pg';

@injectable()
class PostgresConnection {
  private connection: PoolClient | null;
  constructor(@inject('IDataBase') private database: IDataBase<PoolClient>) {
    this.connection = null;
  }

  public async getConnection(): Promise<PoolClient> {
    if (this.connection !== null && this.connection !== undefined) {
      return this.connection;
    }
    this.connection = await this.database.connect();
    return this.connection;
  }

  public release(): void {
    if (this.connection !== null && this.connection !== undefined) {
      this.connection.release();
      this.connection = null;
    }
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<Promise<T>> {
    const client = await this.getConnection();
    try {
      await client.query('BEGIN');
      const result = await callback(client);

      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export { PostgresConnection };
