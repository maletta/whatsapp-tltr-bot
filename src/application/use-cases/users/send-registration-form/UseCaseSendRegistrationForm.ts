import { IChat, IGroupChat } from 'common/CustomTypes';
import { ChatEntity, ChatEntityDTO } from 'domain/entities/chats/ChatEntity';
import { IChatRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/interfaces/IDataBase';
import { inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

enum ErrorsEnum {
  'NoQuestionsAvailable' = 'NoQuestionsAvailable',
  'NoFormsAvailable' = 'NoFormsAvailable',
  'NoValidGroupChat' = 'NoValidGroupChat',
}
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

      const chatFromDatabase = await this.findOrCreateChat(chat);

      // se não encontrou ou não criou o chat
      if (chatFromDatabase === null || chatFromDatabase === undefined) {
        return errorsMessages.NoFormsAvailable;
      }

      const questions = await this.questionRepository.findByChatId(
        chatFromDatabase.id,
      );

      console.log('found questions', questions);

      // se o grupo está cadastrado, mas não existem questões cadastradas
      if (questions === null || questions === undefined) {
        return errorsMessages.NoQuestionsAvailable;
      }

      const questionsResponse = questions
        .map((item) => item.question)
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

    const chatFound = await this.chatRepository.findByWhatsAppId(chatRegistry);

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
}

export { UseCaseSendRegistrationForm };
