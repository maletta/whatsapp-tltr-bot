import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import {
  QuestionDTO,
  QuestionEntity,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { IRepositoryConnection } from 'domain/interfaces/repositories/IRepositoryConnection';

abstract class IQuestionsRepository<T> extends IRepositoryConnection<T> {
  abstract create(questionDTO: QuestionDTO): Promise<boolean>;
  abstract update(questionEntity: QuestionEntity): Promise<boolean>;
  abstract findById(id: number): Promise<QuestionEntity | null>;
  abstract findByChatId(id: number): Promise<QuestionEntity[] | null>;
  abstract findByUserAndChat(
    user: UserEntity,
    chat: ChatEntity,
  ): Promise<QuestionEntity[] | null>;
}

export { IQuestionsRepository };
