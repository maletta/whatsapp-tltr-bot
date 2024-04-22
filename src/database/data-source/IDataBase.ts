import EventEmitter from 'events';

export interface IDatabase<T extends EventEmitter, U extends EventEmitter> {
  query(text: string, params: any[]): Promise<any>;
  transaction(callback: (client: U) => Promise<void>): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
