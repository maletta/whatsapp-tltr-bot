import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';
import {
  IRead,
  IWrite,
} from 'domain/interfaces/repositories/IRepositoryReadAndWrite';
import { Pool, PoolClient, QueryResult } from 'pg';

// Constructor precisa de id ? se for chave composta ?
// COnstructor precisa do nome da tabela ?
abstract class IBasePostgresRepository<T>
  extends IRepositoryConnection<PoolClient>
  implements IRead<T>, IWrite<T>
{
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

  async create(item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async find(item: T): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  async findOne(id: number): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
}

export { IBasePostgresRepository };
