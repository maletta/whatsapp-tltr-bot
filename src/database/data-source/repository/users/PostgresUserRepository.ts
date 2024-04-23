import { UserEntity } from 'domain/entities/users/UserEntity';
import { IBasePostgresRepository } from '../../postgres/interfaces/IBasePostgresRepository';

class PostgresUserRepository extends IBasePostgresRepository<UserEntity> {
  constructor() {
    super('users', ['id']);
  }

  async create(user: UserEntity): Promise<boolean> {
    const { tableName } = this.metadata;
    const connection = this.getConnection();
    const query = `INSERT INTO ${tableName} ( id_whatsapp, cellphone, info_name) VALUES ($1, $2, $3)`;
    const result = await connection.query(query, [
      user.idWhatsapp,
      user.cellphone,
      user.infoName,
    ]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  async update(id: string, item: UserEntity): Promise<boolean> {
    const { cellphone, idWhatsapp, infoName } = item;
    const connection = this.getConnection();
    const query =
      'UPDATE users SET id_whatsapp = $2, cellphone = $3, info_name = $4 WHERE id = $1';

    const result = await connection.query(query, [
      id,
      idWhatsapp,
      cellphone,
      infoName,
    ]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const connection = this.getConnection();
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await connection.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  async findByName(name: string): Promise<UserEntity[]> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM users WHERE name LIKE $1';
    const result = await connection.query(query, [name]);

    return result.rows;
  }

  async findOne(id: number): Promise<UserEntity | null> {
    const { tableName } = this.metadata;
    const connection = this.getConnection();
    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}

export { PostgresUserRepository };
