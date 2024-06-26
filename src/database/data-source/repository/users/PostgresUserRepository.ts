import {
  IUserEntityDatabaseModel,
  UserEntity,
  UserEntityDTO,
} from 'domain/entities/users/UserEntity';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';

class PostgresUserRepository extends IUsersRepository<PoolClient> {
  public async setConnection(
    connection: PoolClient | Promise<PoolClient>,
  ): Promise<void> {
    this.connection = await connection;
  }
  public getConnection(): PoolClient {
    if (this.connection === null) {
      throw new Error(`Connection not set in ${this.constructor.name}`);
    }
    return this.connection;
  }

  async create(user: UserEntityDTO): Promise<UserEntity | null> {
    const connection = this.getConnection();
    const query = `INSERT INTO users ( whatsapp_registry, cellphone, info_name) VALUES ($1, $2, $3) RETURNING *`;
    const result = await connection.query<IUserEntityDatabaseModel>(query, [
      user.whatsappRegistry,
      user.cellphone,
      user.infoName,
    ]);

    if (result.rowCount !== null && result.rowCount > 0) {
      return UserEntity.createFromDatabase(result.rows[0]);
    }
    return null;
  }

  async update(user: UserEntity): Promise<boolean> {
    const { cellphone, whatsappRegistry, infoName, id } = user;
    const connection = this.getConnection();
    const query =
      'UPDATE users SET id_whatsapp = $2, cellphone = $3, info_name = $4 WHERE id = $1';

    const result = await connection.query(query, [
      id,
      whatsappRegistry,
      cellphone,
      infoName,
    ]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const connection = this.getConnection();
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await connection.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByName(name: string): Promise<UserEntity[]> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM users WHERE name LIKE $1';
    const result = await connection.query(query, [name]);

    return result.rows;
  }

  async findByWhatsAppRegistry(registry: string): Promise<UserEntity | null> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM users WHERE whatsapp_registry = $1';
    const result = await connection.query<IUserEntityDatabaseModel>(query, [
      registry,
    ]);

    if (result.rowCount !== null && result.rowCount > 0) {
      return UserEntity.createFromDatabase(result.rows[0]);
    }

    return null;
  }

  async delete(id: string): Promise<boolean> {
    const connection = this.getConnection();
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await connection.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }
}

export { PostgresUserRepository };
