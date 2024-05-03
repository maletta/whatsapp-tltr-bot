import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { IRepositoryConnection } from '../IRepositoryConnection';

abstract class IChatsConfigurationRepository<
  T,
> extends IRepositoryConnection<T> {
  abstract create(chatEntity: ChatEntity): Promise<ChatEntity | null>;
}

export { IChatsConfigurationRepository };
