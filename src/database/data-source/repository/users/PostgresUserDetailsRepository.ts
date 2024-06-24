import {
  IUsersDetailsDatabaseModel,
  IUsersDetailsEntityDTO,
  UsersDetailsEntity,
} from 'domain/entities/users/UserDetailsEntity';

import { IUsersDetailsRepository } from 'domain/interfaces/repositories/users/IUserDetailsRepository';
import { PoolClient } from 'pg';

class PostgresUserDetailsRepository extends IUsersDetailsRepository<PoolClient> {
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

  async createOrUpdate(
    userDetails: IUsersDetailsEntityDTO,
  ): Promise<UsersDetailsEntity | null> {
    const connection = this.getConnection();

    const dataBaseObject = UsersDetailsEntity.createToDatabase(userDetails);
    const notNullFields = Object.entries(dataBaseObject).filter(
      ([_, values]) => values !== null,
    );

    // campos não nulos que serão inseridos OU atualizados no banco
    const queryFields = notNullFields.map(([field]) => field);

    // valores dos campos não nulos inseridos no banco
    const insertValues = notNullFields.map((_, index) => `$${index + 1}`);

    // valores dos campos não nulos atualizados no banco
    // começa a contar o wildcard a partir do valor do último campo não nulo da inserção
    const updateValues = notNullFields.map(([field, _], index) => {
      const queryWildcardField = index + insertValues.length + 1;
      return `${field} = $${queryWildcardField}`;
    });

    // query tenta inserir, caso já haja então atualiza
    const query = `
    INSERT INTO users_details (${queryFields.join(', ')})
    VALUES (${insertValues.join(', ')})
    ON CONFLICT (id_user, id_chat)
    DO UPDATE SET ${updateValues.join(', ')}, updated_at=now() RETURNING *;
    `;
    const result = await connection.query<IUsersDetailsDatabaseModel>(query, [
      ...notNullFields.map(([_, value]) => value), // para campos de inserção
      ...notNullFields.map(([_, value]) => value), // para compos de atualização
    ]);

    if (result.rowCount !== null && result.rowCount > 0) {
      return UsersDetailsEntity.createFromDatabase(result.rows[0]);
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

export { PostgresUserDetailsRepository };
