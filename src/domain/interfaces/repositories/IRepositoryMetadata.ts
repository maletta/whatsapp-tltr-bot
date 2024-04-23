class IRepositoryMetadata {
  public tableName: string;
  public primariesKeys: string[];

  constructor(tableName: string, primariesKeys: string[]) {
    this.tableName = tableName;
    this.primariesKeys = primariesKeys;
  }
}
export { IRepositoryMetadata };
