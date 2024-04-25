abstract class IDataBase<U> {
  abstract init(): Promise<U | void>;
  abstract transaction(callback: (client: U) => Promise<void>): Promise<void>;
  abstract connect(): Promise<U>;
}

export { IDataBase };
