import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { IAnswersRepository } from 'domain/interfaces/repositories/chats/IAnswersRepository';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
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
    @inject('UsersDetailsRepository')
    private usersDetailsRepository: IUsersRepository<PoolClient>,
    @inject('QuestionsRepository')
    private questionsRepository: IQuestionsRepository<PoolClient>,
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  public async execute(message: Message): Promise<QuestionAnswer[] | null> {
    const completedRegistrationForm = message.body;

    const connection = await this.database.getConnection();
    this.chatsRepository.setConnection(connection);
    this.usersRepository.setConnection(connection);
    this.usersDetailsRepository.setConnection(connection);
    this.questionsRepository.setConnection(connection);

    try {
      // procura chat na base ou cadastra
      const chat = await this.findChat(message);

      if (chat === null) {
        console.log('chat não encontrado');
        return null;
      }

      // busca por usuário na base ou cadastra
      const user = await this.findOrCreateUser(message);

      if (user === null) {
        console.log('user não encontrado');
        return null;
      }

      // busca questões de cadastro de um chat
      const questions = await this.questionsRepository.findByChatId(chat.id);

      if (questions === null) {
        console.log('questions não encontrado');
        return null;
      }

      // extrai respostas da mensagem do usuário
      const answers: QuestionAnswer[] = this.extractAnswers(
        completedRegistrationForm,
        questions,
      );

      // cadastra as respostas do usuário

      // retorna as respostas

      return answers;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      this.database.release();
    }
  }

  // lê o formulário de respostas do usuário e as questões cadastradas no BD para o chat
  // retorna um array de objetos com as perguntas e as respostas
  private extractAnswers(
    message: string,
    questions: QuestionEntity[],
  ): QuestionAnswer[] {
    const answers: QuestionAnswer[] = [];

    const answersLinesNormalized = message
      .split('\n')
      .map((answer) => this.normalizeString(answer));

    questions.forEach((question) => {
      const questionNormalized = this.normalizeString(question.question);

      const answerFound = answersLinesNormalized.find((currentAnswer) => {
        return currentAnswer.includes(questionNormalized);
      });

      if (answerFound !== undefined) {
        const answer = answerFound.replace(questionNormalized, '').trim();
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
    const whatsAppRegistry = message.from;
    if (!chat.isGroup) {
      return null;
    }
    const chatFound =
      await this.chatsRepository.findByWhatsAppRegistry(whatsAppRegistry);
    return chatFound;
  }

  private async findOrCreateUser(message: Message): Promise<UserEntity | null> {
    const userWhatsAppRegistry = message.author!;
    const userContact = await message.getContact();

    const userFound =
      await this.usersRepository.findByWhatsAppRegistry(userWhatsAppRegistry);

    if (userFound !== null && userFound !== undefined) {
      return userFound;
    }

    const createdUser = await this.usersRepository.create({
      cellphone: userContact.number,
      infoName: userContact.pushname,
      whatsappRegistry: userWhatsAppRegistry,
    });

    return createdUser;
  }

  private async saveAnswers(
    user: UserEntity,
    answersAndQuestions: QuestionAnswer[],
  ): Promise<boolean> {
    try {
      const transactionResult = await this.database.transaction(
        async (newConnection) => {
          this.answersRepository.setConnection(newConnection);

          const answersToSave: Promise<boolean>[] = answersAndQuestions.map(
            (answerAndQuestion) => {
              return this.answersRepository.create({
                idQuestion: answerAndQuestion.question.id,
                idUser: user.id,
                answer: answerAndQuestion.answer,
              });
            },
          );

          await Promise.all(answersToSave);
          return true;
        },
      );

      return transactionResult;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private normalizeString(str: string): string {
    return str
      .replace(/[^a-zA-ZÀ-ÿ0-9\s()@#\/\\\-_<>]/g, '') // ^ nega a correspondência
      .trim();
  }
}

export { UseCaseRegisterUser };
