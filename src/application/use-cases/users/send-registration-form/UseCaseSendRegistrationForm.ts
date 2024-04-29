import { IChat, IGroupChat } from 'common/CustomTypes';
import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { RegistrationQuestionsColumns } from 'domain/enums/chats/Question';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/interfaces/IDataBase';
import { inject, injectable } from 'tsyringe';
import { StringUtils } from 'utils/String.utils';
import { Message } from 'whatsapp-web.js';

enum ErrorsEnum {
  'NoQuestionsAvailable' = 'NoQuestionsAvailable',
  'NoFormsAvailable' = 'NoFormsAvailable',
  'NoValidGroupChat' = 'NoValidGroupChat',
}
@injectable()
class UseCaseSendRegistrationForm {
  constructor(
    @inject('ChatsRepository')
    private chatRepository: IChatsRepository<PoolClient>,
    @inject('QuestionsRepository')
    private questionRepository: IQuestionsRepository<PoolClient>,
    @inject('IDataBase') private database: IDataBase<PoolClient>,
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

    const connection = await this.database.connect();

    try {
      const chat = (await message.getChat()) as IChat;

      // somente grupos podem usar a funcionalidade
      if (!chat.isGroup) {
        return errorsMessages.NoValidGroupChat;
      }

      await this.chatRepository.setConnection(connection);
      await this.questionRepository.setConnection(connection);

      const chatFromDatabase = await this.findOrCreateChat(chat);

      // se não encontrou ou não criou o chat
      if (chatFromDatabase === null || chatFromDatabase === undefined) {
        return errorsMessages.NoFormsAvailable;
      }

      console.log('chat id ', chatFromDatabase);

      const questions = await this.questionRepository.findByChatId(
        chatFromDatabase.id,
      );

      console.log('found questions', questions);

      // se o grupo está cadastrado, mas não existem questões cadastradas
      if (questions === null || questions === undefined) {
        return errorsMessages.NoQuestionsAvailable;
      }

      const orderedQuestions = this.orderQuestionByEnum(questions);

      const questionsResponse = orderedQuestions
        .map((item) => StringUtils.replaceBreakingLines(item.question))
        .join('\n');

      return questionsResponse;
    } catch (error) {
      console.log(error);
      return errorsMessages.NoFormsAvailable;
    } finally {
      connection.release();
    }
  }

  private async findOrCreateChat(
    chatGroup: IGroupChat,
  ): Promise<ChatEntity | null> {
    const chatRegistry = `${chatGroup.id.user}${chatGroup.id.server}`;

    const chatFound =
      await this.chatRepository.findByWhatsAppRegistry(chatRegistry);

    if (chatFound !== null && chatFound !== undefined) {
      return chatFound;
    }

    const chatDto: ChatEntityDTO = {
      name: chatGroup.groupMetadata.subject,
      whatsappRegistry: chatRegistry,
    };
    const createdChat = await this.chatRepository.create(chatDto);

    return createdChat;
  }

  private orderQuestionByEnum(questions: QuestionEntity[]): QuestionEntity[] {
    const questionsOrdered: QuestionEntity[] = [];
    const orderSequence = [
      RegistrationQuestionsColumns.QUESTIONS_HEADER,
      RegistrationQuestionsColumns.NAME,
      RegistrationQuestionsColumns.PRONOUN,
      RegistrationQuestionsColumns.AGE,
      RegistrationQuestionsColumns.LOCATION,
      RegistrationQuestionsColumns.SIGN,
      RegistrationQuestionsColumns.SEXUAL_ORIENTATION,
      RegistrationQuestionsColumns.RELATIONSHIP,
      RegistrationQuestionsColumns.MADNESS_FOR_LOVE,
      RegistrationQuestionsColumns.INSTAGRAM,
      RegistrationQuestionsColumns.PHOTO,
    ];

    orderSequence.forEach((currentEnum) => {
      const questionFound = questions.find(
        (q) => q.questionColumnType === currentEnum,
      );

      if (questionFound !== undefined && questionFound !== null) {
        questionsOrdered.push(questionFound);
      }
    });

    return questionsOrdered;
  }
}

export { UseCaseSendRegistrationForm };
