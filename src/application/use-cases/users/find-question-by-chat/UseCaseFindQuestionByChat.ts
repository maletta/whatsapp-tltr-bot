import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { inject, injectable } from 'tsyringe';

@injectable()
class UseCaseFindQuestionByChat {
  constructor(
    @inject('QuestionsRepository')
    private questionsRepository: IQuestionsRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  public async execute(chat: ChatEntity): Promise<QuestionEntity[] | null> {
    const connection = await this.database.getConnection();
    try {
      await this.questionsRepository.setConnection(connection);
      const questions = await this.questionsRepository.findByChatId(chat.id);

      return questions;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      this.database.release();
    }
  }
}

export { UseCaseFindQuestionByChat };
