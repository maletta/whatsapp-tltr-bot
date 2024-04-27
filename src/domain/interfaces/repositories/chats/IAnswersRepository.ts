import {
  AnswerDTO,
  AnswerEntity,
  QuestionEntity,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { IRepositoryConnection } from '../IRepositoryConnection';

abstract class IAnswersRepository<T> extends IRepositoryConnection<T> {
  abstract create(answer: AnswerDTO): Promise<boolean>;
  abstract update(answer: AnswerEntity): Promise<boolean>;
  abstract findById(id: number): Promise<AnswerEntity | null>;
  abstract findByUserAndChat(
    userWhatsAppId: string,
    chatWhatsAppId: string,
  ): Promise<AnswerEntity[] | null>;
  abstract findByQuestions(
    questions: QuestionEntity[],
  ): Promise<AnswerEntity[] | null>;
}

export { IAnswersRepository };
