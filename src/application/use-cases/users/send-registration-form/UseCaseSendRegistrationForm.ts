import { OrderQuestionsByEnum } from 'application/services/chats/order-questions-by-enum/OrderQuestionsByEnum';
import { UseCaseFindOrCreateGroupChat } from 'application/use-cases/chats/find-or-create-group-chat/UseCaseFindOrCreateGroupChat';
import { IChat } from 'common/CustomTypes';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { container, inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

enum ErrorsEnum {
  'NoQuestionsAvailable' = 'NoQuestionsAvailable',
  'NoFormsAvailable' = 'NoFormsAvailable',
  'NoValidGroupChat' = 'NoValidGroupChat',
}
// Refatorar send-registration-form para apenas retornar registration forms
// e ser aproveitado no lugar de UseCaseFindQuestionByChat
// o problema é os erros que ele retorna, como tratar os erros
// para mostrar messagm correta?
@injectable()
class UseCaseSendRegistrationForm {
  constructor(
    @inject('QuestionsRepository')
    private questionRepository: IQuestionsRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  public async execute(message: Message): Promise<string> {
    // erros retornados ao usuário
    const errorsMessages: Record<ErrorsEnum, string> = {
      [ErrorsEnum.NoQuestionsAvailable]:
        'Não há perguntas disponíveis no momento.',
      [ErrorsEnum.NoFormsAvailable]:
        'Não existe ficha de cadastro para o grupo',
      [ErrorsEnum.NoValidGroupChat]:
        'Funcionalidade disponível apenas para grupos',
    };

    const connection = await this.database.getConnection();

    try {
      const chat = (await message.getChat()) as IChat;

      // somente grupos podem usar a funcionalidade
      if (!chat.isGroup) {
        return errorsMessages.NoValidGroupChat;
      }

      await this.questionRepository.setConnection(connection);

      const useCaseFindOrCreateGroupChat = container.resolve(
        UseCaseFindOrCreateGroupChat,
      );

      const chatFromDatabase = await useCaseFindOrCreateGroupChat.execute(chat);

      // se não encontrou ou não criou o chat
      if (chatFromDatabase === null || chatFromDatabase === undefined) {
        return errorsMessages.NoFormsAvailable;
      }

      const questions = await this.questionRepository.findByChatId(
        chatFromDatabase.id,
      );

      // se o grupo está cadastrado, mas não existem questões cadastradas
      if (questions === null || questions === undefined) {
        return errorsMessages.NoQuestionsAvailable;
      }

      const orderQuestionsByEum = new OrderQuestionsByEnum();
      const orderedQuestions = orderQuestionsByEum.execute(questions);

      const questionsResponse = orderedQuestions
        .map(({ question }) => question)
        .join('\n');

      return questionsResponse;
    } catch (error) {
      console.log(error);
      return errorsMessages.NoFormsAvailable;
    } finally {
      this.database.release();
    }
  }
}

export { UseCaseSendRegistrationForm };
