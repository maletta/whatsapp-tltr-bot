import {
  ChatEntity,
  ChatEntityDTO,
  IChatDatabaseModel,
} from 'domain/entities/chats/ChatEntity';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { PoolClient } from 'pg';

class PostgresChatsRepository extends IChatsRepository<PoolClient> {
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

  async create(chat: ChatEntityDTO): Promise<ChatEntity | null> {
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

  async update(chat: ChatEntityDTO): Promise<boolean> {
    const { name, whatsappRegistry } = chat;
    const connection = this.getConnection();
    const query = 'UPDATE chats SET name = $2 WHERE id = $1';

    const result = await connection.query(query, [whatsappRegistry, name]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  async findByWhatsAppRegistry(id: string): Promise<ChatEntity | null> {
    const connection = this.getConnection();
    const query = `
      SELECT
      c.id,
      c.name,
      c.whatsapp_registry,
      c.created_at,
      c.updated_at,
      config.notify_new_user_detail,
      config.only_registered_user_mode
      FROM chats c
      INNER JOIN chats_configuration config
      ON c.id = config.id_chat
      WHERE whatsapp_registry = $1
    `;
    const result = await connection.query<IChatDatabaseModel>(query, [id]);

    console.log('CHATS REPOSITORY');
    console.log(result);
    if (result.rowCount === 0) return null;
    return ChatEntity.createFromDatabase(result.rows[0]);
  }
}

export { PostgresChatsRepository };
