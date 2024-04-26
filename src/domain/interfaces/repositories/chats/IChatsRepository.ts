import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';

abstract class IChatRepository<T> extends IRepositoryConnection<T> {
  abstract create(chat: ChatEntityDTO): Promise<ChatEntity | null>;
  abstract update(chat: ChatEntityDTO): Promise<boolean>;
  abstract findByWhatsAppId(id: string): Promise<ChatEntity | null>;
}

export { IChatRepository };
