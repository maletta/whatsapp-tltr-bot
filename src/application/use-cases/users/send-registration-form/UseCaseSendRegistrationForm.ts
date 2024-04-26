import { IChatRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/interfaces/IDataBase';
import { inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

@injectable()
class UseCaseSendRegistrationForm {
  constructor(
    @inject('ChatRepository')
    private chatRepository: IChatRepository<PoolClient>,
    @inject('QuestionRepository')
    private questionRepository: IQuestionsRepository<PoolClient>,
    @inject('IDataBase') private database: IDataBase<PoolClient>,
  ) {}

  public async execute(message: Message): Promise<string> {
    const messageWithNoQuestionsAvailable =
      'Não existe ficha de cadastro para o grupo';

    try {
      const client = await this.database.connect();
      await this.chatRepository.setConnection(client);
      const chats = await this.chatRepository.findByWhatsAppId(message.from);
      console.log('found chats', chats);

      if (chats === null || chats === undefined)
        return messageWithNoQuestionsAvailable;

      const questions = await this.questionRepository.findByChatId(chats.id);
      console.log('found questions', questions);

      if (questions === null || questions === undefined)
        return messageWithNoQuestionsAvailable;

      const questionsResponse = questions
        .map((item) => item.question)
        .join('\n');

      return questionsResponse;
    } catch (error) {
      console.log(error);
      return messageWithNoQuestionsAvailable;
    }
  }
}

export { UseCaseSendRegistrationForm };
