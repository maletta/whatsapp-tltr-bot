import { IGroupChat } from 'common/CustomTypes';
import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { IChatsConfigurationRepository } from 'domain/interfaces/repositories/chats/IChatsConfigurationRepository';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { inject, injectable } from 'tsyringe';

@injectable()
class UseCaseFindOrCreateGroupChat {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository<PoolClient>,
    @inject('ChatsConfigurationRepository')
    private chatsConfigurationRepository: IChatsConfigurationRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  public async execute(chatGroup: IGroupChat): Promise<ChatEntity | null> {
    try {
      const response = await this.database.transaction(async (connection) => {
        await this.chatsRepository.setConnection(connection);
        await this.chatsConfigurationRepository.setConnection(connection);

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

        if (createdChat === null) {
          return null;
        }

        const createdChatConfiguration =
          await this.chatsConfigurationRepository.create(createdChat);

        if (createdChatConfiguration === null) {
          return null;
        }

        const chatEntity = new ChatEntity({
          ...createdChat,
          ...createdChatConfiguration,
        });

        return chatEntity;
      });

      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export { UseCaseFindOrCreateGroupChat };
