import { IRepositoryMetadata } from './IRepositoryMetadata';

abstract class IRepositoryConnection<T> {
  protected connection: T | null = null;
  public metadata: IRepositoryMetadata;
  public abstract setConnection(connection: T | Promise<T>): Promise<void>;
  public abstract getConnection(): T;

  constructor(tableName: string, primariesKeys: string[]) {
    this.metadata = new IRepositoryMetadata(tableName, primariesKeys);
  }
}

export { IRepositoryConnection };
