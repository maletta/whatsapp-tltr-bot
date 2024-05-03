import { IGroupChat } from 'common/CustomTypes';
import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { inject, injectable } from 'tsyringe';

@injectable()
class UseCaseFindOrCreateGroupChat {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  public async execute(chatGroup: IGroupChat): Promise<ChatEntity | null> {
    const connection = await this.database.getConnection();
    try {
      await this.chatsRepository.setConnection(connection);
      const chatRegistry = `${chatGroup.id.user}@${chatGroup.id.server}`;

      const chatFound =
        await this.chatsRepository.findByWhatsAppRegistry(chatRegistry);

      if (chatFound !== null && chatFound !== undefined) {
        return chatFound;
      }

      const chatDto: ChatEntityDTO = {
        name: chatGroup.groupMetadata.subject,
        whatsappRegistry: chatRegistry,
      };
      const createdChat = await this.chatsRepository.create(chatDto);

      return createdChat;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      this.database.release();
    }
  }
}

export { UseCaseFindOrCreateGroupChat };
