import { BaseModel } from 'domain/interfaces/entities/BaseModel';

type State<T = Enumerator, U = BaseModel<T>> = Map<T, U>;

class GeneratedTextsGroup<T = Enumerator, U = BaseModel<T>> {
  private state: State<T, U>;

  constructor() {
    this.state = new Map();
  }

  addItem(key: T, item: U) {
    this.state.set(key, item);
  }

  getItem(key: T): U | undefined | null {
    return this.state.get(key);
  }

  removeItem(key: T) {
    this.state.delete(key);
  }

  hasItem(key: T): boolean {
    return this.state.has(key);
  }
}

export { GeneratedTextsGroup };
