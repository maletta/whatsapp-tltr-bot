import {
  ChatConfigurationEntity,
  ChatEntity,
  ChatEntityWithoutConfiguration,
  IChatConfigurationDatabaseModel,
  IChatDatabaseModel,
} from 'domain/entities/chats/ChatEntity';
import { IChatsConfigurationRepository } from 'domain/interfaces/repositories/chats/IChatsConfigurationRepository';
import { PoolClient } from 'pg';

class PostgresChatsConfigurationRepository extends IChatsConfigurationRepository<PoolClient> {
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

  async create(
    chat: ChatEntityWithoutConfiguration,
  ): Promise<ChatConfigurationEntity | null> {
    const { id } = chat;
    const connection = this.getConnection();
    const query = `INSERT INTO chats_configuration ( id_chat, notify_new_user_detail,only_registered_user_mode) 
    VALUES ($1, TRUE, FALSE) RETURNING *`;

    const result = await connection.query<IChatConfigurationDatabaseModel>(
      query,
      [id],
    );

    if (result.rowCount !== null && result.rowCount > 0) {
      return ChatConfigurationEntity.createFromDatabase(result.rows[0]);
    }

    return null;
  }
}

export { PostgresChatsConfigurationRepository };
