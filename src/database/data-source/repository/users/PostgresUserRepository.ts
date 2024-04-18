import { UserEntity } from 'domain/entities/users/UserEntity';
import { IDatabase } from '../../IDataBase';
import { Pool, PoolClient } from 'pg';
import { IUserRepository } from 'domain/interfaces/repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import { PostgresDatabase } from '../../postgres/PostgresDatabase';

type UserQuery = {
  id: number;
  name: string;
  email: string;
};
@injectable()
class PostgresUserRepository implements IUserRepository {
  constructor(@inject('IDataBase') private readonly db: PostgresDatabase) {}

  async create(contact: UserEntity): Promise<void> {
    const query = 'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)';
    await this.db.query(query, [contact.id, contact.name, contact.email]);
  }

  async update(contact: UserEntity): Promise<void> {
    const query = 'UPDATE users SET name = $2, email = $3 WHERE id = $1';
    await this.db.query(query, [contact.id, contact.name, contact.email]);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const { id: contactId, name, email } = result.rows[0];
    return new UserEntity(contactId, name, email);
  }

  async findByName(nameParam: string): Promise<UserEntity[]> {
    const query = 'SELECT * FROM users WHERE name LIKE $1';
    const result = await this.db.query<UserQuery>(query, [`%${nameParam}%`]);
    if (result.rows.length === 0) {
      return [];
    }

    const mappedNewUsers: UserEntity[] = result.rows[0].map(
      ({ id, name, email }) => new UserEntity(id, name, email),
    );

    return mappedNewUsers;
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await this.db.query(query, [id]);
  }
}

export { PostgresUserRepository };
