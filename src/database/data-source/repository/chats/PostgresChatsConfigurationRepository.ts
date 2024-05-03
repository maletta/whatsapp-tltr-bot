import {
  ChatEntity,
  ChatEntityDTO,
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

  async create(chat: ChatEntity): Promise<ChatEntity | null> {
    const { name, whatsappRegistry } = chat;
    const connection = this.getConnection();
    const query = `INSERT INTO chats ( whatsapp_registry, name) VALUES ($1, $2) RETURNING *`;
    const result = await connection.query<IChatDatabaseModel>(query, [
      whatsappRegistry,
      name,
    ]);

    if (result.rowCount !== null && result.rowCount > 0) {
      return ChatEntity.createFromDatabase(result.rows[0]);
    }

    return null;
  }
}

export { PostgresChatsConfigurationRepository };
