import {
  ChatConfigurationEntity,
  ChatEntity,
  ChatEntityWithoutConfiguration,
} from 'domain/entities/chats/ChatEntity';
import { IRepositoryConnection } from '../IRepositoryConnection';

abstract class IChatsConfigurationRepository<
  T,
> extends IRepositoryConnection<T> {
  abstract create(
    chatEntity: ChatEntityWithoutConfiguration,
  ): Promise<ChatConfigurationEntity | null>;
}

export { IChatsConfigurationRepository };
