import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';
import {
  IRead,
  IWrite,
} from 'domain/interfaces/repositories/IRepositoryReadAndWrite';
import { Pool, PoolClient, QueryResult } from 'pg';

// Constructor precisa de id ? se for chave composta ?
// COnstructor precisa do nome da tabela ?
abstract class IBasePostgresRepository<
  T,
> extends IRepositoryConnection<PoolClient> {
  protected connection: PoolClient | null = null;

  getConnection(): PoolClient {
    if (this.connection === null) {
      throw new Error('Connection not set in IBasePostgresRepository.');
    }
    return this.connection;
  }
  async setConnection(
    connection: PoolClient | Promise<PoolClient>,
  ): Promise<void> {
    this.connection = await connection;
  }
}

export { IBasePostgresRepository };
