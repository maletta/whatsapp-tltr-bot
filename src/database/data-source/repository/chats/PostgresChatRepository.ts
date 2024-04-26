import {
  ChatEntity,
  ChatEntityDTO,
  IChatDatabaseModel,
} from 'domain/entities/chats/ChatEntity';
import { IChatRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { PoolClient } from 'pg';

class PostgresChatRepository extends IChatRepository<PoolClient> {
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

  async findByWhatsAppId(id: string): Promise<ChatEntity | null> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM chats where whatsapp_registry = $1';
    const result = await connection.query(query, [id]);
    if (result.rowCount === 0) return null;
    return new ChatEntity(result.rows[0]);
  }
}

export { PostgresChatRepository };
