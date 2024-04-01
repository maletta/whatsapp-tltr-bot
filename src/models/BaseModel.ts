interface IBaseDTO<T> {
  key: T;
  content: string;
  createdAt?: Date;
}

abstract class BaseModel<T = Enumerator> {
  public key: T;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  constructor({ key, content, createdAt = new Date() }: IBaseDTO<T>) {
    this.key = key;
    this.content = content;
    this.createdAt = createdAt;
    this.expiresIn = this.calculateExpiration(createdAt, key);
  }

  protected abstract calculateExpiration(createAt: Date, key: T): Date;

  public isValid(): boolean {
    const now = Date.now();
    return now < this.expiresIn.getTime();
  }
}

export { BaseModel };
