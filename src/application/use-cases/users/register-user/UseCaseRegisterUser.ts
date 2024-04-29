import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/postgres/PostgresDatabase';
import { inject, injectable } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

type QuestionAnswer = {
  question: QuestionEntity;
  answer: string;
};

@injectable()
class UseCaseRegisterUser {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository<PoolClient>,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<PoolClient>,
    @inject('QuestionsRepository')
    private questionsRepository: IQuestionsRepository<PoolClient>,
    @inject('IDataBase') private database: IDataBase<PoolClient>,
  ) {}

  public async execute(message: Message): Promise<QuestionAnswer[] | null> {
    const completedRegistrationForm = message.body;

    const connection = await this.database.connect();
    this.chatsRepository.setConnection(connection);
    this.usersRepository.setConnection(connection);
    this.questionsRepository.setConnection(connection);

    try {
      const chat = await this.findChat(message);

      if (chat === null) {
        return null;
      }

      const user = await this.findOrCreateUser(message);

      if (user === null) {
        return null;
      }

      const questions = await this.questionsRepository.findByChatId(chat.id);

      if (questions === null) {
        return null;
      }

      const answers = this.extractAnswers(completedRegistrationForm, questions);

      return answers;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      connection.release();
    }
  }

  // lê o formulário de respostas do usuário e as questões cadastradas no BD para o chat
  // retorna um array de objetos com as perguntas e as respostas
  private extractAnswers(
    message: string,
    questions: QuestionEntity[],
  ): QuestionAnswer[] {
    const answers: QuestionAnswer[] = [];

    const answersLinesNormalized = message.split('\n').map((answer) => ({
      normalized: this.normalizeString(answer),
      nonNormalized: answer,
    }));

    questions.forEach((question) => {
      const questionNormalized = this.normalizeString(question.question);

      const answerFound = answersLinesNormalized.find((currentAnswer) => {
        console.log('question normalized', questionNormalized);
        console.log('current answer normalized', currentAnswer.normalized);
        return currentAnswer.normalized.includes(questionNormalized);
      });

      if (answerFound !== undefined) {
        const answer = answerFound.normalized
          .replace(questionNormalized, '')
          .trim();
        answers.push({
          question: question,
          answer: answer,
        });
      }
    });

    return answers;
  }

  private async findChat(message: Message): Promise<ChatEntity | null> {
    const chat = await message.getChat();
    const whatsAppRegistry = `${chat.id.user}${chat.id.server}`;
    if (!chat.isGroup) {
      return null;
    }
    const chatFound =
      await this.chatsRepository.findByWhatsAppRegistry(whatsAppRegistry);
    return chatFound;
  }

  private async findOrCreateUser(message: Message): Promise<UserEntity | null> {
    const userFound = await this.usersRepository.findByWhatsAppRegistry(
      message.author!,
    );

    if (userFound !== null && userFound !== undefined) {
      return userFound;
    }

    const userContact = await message.getContact();
    const userWhatsAppRegistry = `${userContact.id.user}${userContact.id.server}`;

    const createdUser = await this.usersRepository.create({
      cellphone: userContact.number,
      infoName: userContact.pushname,
      whatsappRegistry: userWhatsAppRegistry,
    });

    return createdUser;
  }

  private normalizeString(str: string): string {
    return str
      .replace(/[^a-zA-ZÀ-ÿ0-9\s()@#\/\\\-_<>]/g, '') // ^ nega a correspondência
      .trim();
  }
}

export { UseCaseRegisterUser };
