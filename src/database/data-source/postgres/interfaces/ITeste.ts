import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';
import { IRepositoryMetadata } from 'domain/interfaces/repositories/IRepositoryMetadata';

import { Pool, PoolClient, QueryResult } from 'pg';

interface IWrite<T> {
  create(item: T): Promise<boolean>;

  update(id: string, item: T): Promise<boolean>;

  delete(id: string): Promise<boolean>;
}

interface IRead<T> {
  find(item: T): Promise<T[]>;

  findOne(id: number): Promise<T | null>;
}

abstract class IBaseRepository<T>
  implements IRepositoryConnection<PoolClient>, IRead<T>, IWrite<T>
{
  public metadata: IRepositoryMetadata;

  constructor(medata: IRepositoryMetadata) {
    this.metadata = medata;
  }
  public setConnection(
    connection: PoolClient | Promise<PoolClient>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public getConnection(): PoolClient {
    throw new Error('Method not implemented.');
  }
  find(item: T): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: number): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
  create(item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  protected connection: PoolClient | null = null;
}

export { IBaseRepository };
