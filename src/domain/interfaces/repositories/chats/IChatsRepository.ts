import {
  ChatEntity,
  ChatEntityDTO,
  ChatEntityWithoutConfiguration,
} from 'domain/entities/chats/ChatEntity';
import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';

abstract class IChatsRepository<T> extends IRepositoryConnection<T> {
  abstract create(
    chat: ChatEntityDTO,
  ): Promise<ChatEntityWithoutConfiguration | null>;
  abstract update(chat: ChatEntityDTO): Promise<boolean>;
  abstract findByWhatsAppRegistry(id: string): Promise<ChatEntity | null>;
}

export { IChatsRepository };
