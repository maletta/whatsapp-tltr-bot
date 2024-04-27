import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';
import { IDataBase } from 'src/database/data-source/postgres/PostgresDatabase';
import { inject } from 'tsyringe';
import { Message } from 'whatsapp-web.js';

type QuestionAnswer = {
  question: string;
  answer: string;
};
class UseCaseRegisterUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<PoolClient>,
    @inject('QuestionsRepository')
    private questionsRepository: IQuestionsRepository<PoolClient>,
    @inject('IDataBase') private database: IDataBase<PoolClient>,
  ) {}

  public async execute(message: Message): Promise<QuestionAnswer[] | null> {
    const completedRegistrationForm = message.body;

    const connection = await this.database.connect();
    this.usersRepository.setConnection(connection);
    this.questionsRepository.setConnection(connection);

    if (message.author === null || message.author === undefined) {
      return null;
    }

    const userFound = await this.usersRepository.findByWhatsAppRegistry(
      message.author,
    );
    if (userFound) {
      return null;
    }

    const questions = await this.questionsRepository.findByUserAndChat();
    const answers = this.extractAnswers(completedRegistrationForm, questions);

    return answers;
  }

  // lê o formulário de respostas do usuário e as questões cadastradas no BD para o chat
  // retorna um array de objetos com as perguntas e as respostas
  private extractAnswers(
    message: string,
    questions: QuestionEntity[],
  ): QuestionAnswer[] {
    const answers: QuestionAnswer[] = [];

    let currentQuestionIndex = 0;

    const lines = message.split('\n');

    lines.forEach((line) => {
      // Se a linha atual contém a pergunta

      const lineNormalized = this.normalizeString(line);
      const questionNormalized = this.normalizeString(
        questions[currentQuestionIndex],
      );

      console.log('current line ', lineNormalized);
      console.log('current question  ', questionNormalized);
      if (lineNormalized.includes(questionNormalized)) {
        console.log('includes line ', line);
        // Extrai resposta reomvendo a pergunta
        const answer = lineNormalized.replace(questionNormalized, '').trim();

        answers.push({
          question: questions[currentQuestionIndex],
          answer,
        });

        // Passa para próxima pergunta
        currentQuestionIndex += 1;
      }

      // Se todas as perguntas foram respondidas, sai do loop
      // if (currentQuestionIndex >= questions.length) break;
    });

    return answers;
  }

  private normalizeString(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
      .trim();
  }
}

export { UseCaseRegisterUser };
