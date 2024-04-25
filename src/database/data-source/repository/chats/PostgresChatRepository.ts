import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';
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

  async create(chat: ChatEntityDTO): Promise<boolean> {
    const connection = this.getConnection();
    const query = `INSERT INTO chats ( id_whatsapp) VALUES ($1)`;
    const result = await connection.query(query, [chat.whatsappRegistry]);

    return result.rowCount !== null && result.rowCount > 0;
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
