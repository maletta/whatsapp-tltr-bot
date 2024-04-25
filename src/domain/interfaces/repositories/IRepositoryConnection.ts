abstract class IRepositoryConnection<T> {
  protected connection: T | null = null;
  public abstract setConnection(connection: T | Promise<T>): Promise<void>;
  public abstract getConnection(): T;
}

export { IRepositoryConnection };
