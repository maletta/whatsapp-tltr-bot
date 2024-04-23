interface IWrite<T> {
  create(item: T): Promise<boolean>;

  update(id: string, item: T): Promise<boolean>;

  delete(id: string): Promise<boolean>;
}

interface IRead<T> {
  find(item: T): Promise<T[]>;

  findOne(id: number): Promise<T | null>;
}

export { IWrite, IRead };
