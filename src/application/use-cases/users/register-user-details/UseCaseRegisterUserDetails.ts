import { AnswersExtractor } from 'application/services/chats/extract-answers/ExtractAnswers';
import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import {
  AnswerEntity,
  ExtractedAnswer,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { UsersDetailsEntity } from 'domain/entities/users/UserDetailsEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { RegistrationQuestionsColumns } from 'domain/enums/chats/Question';
import { IAnswersRepository } from 'domain/interfaces/repositories/chats/IAnswersRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUsersDetailsRepository } from 'domain/interfaces/repositories/users/IUserDetailsRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import { inject, injectable } from 'tsyringe';

@injectable()
class UseCaseRegisterUserDetails {
  public constructor(
    @inject('UserDetailsRepository')
    private userDetailsRepository: IUsersDetailsRepository<PoolClient>,
    @inject('QuestionsRepository')
    private questionsRepository: IQuestionsRepository<PoolClient>,
    @inject('AnswersRepository')
    private answersRepository: IAnswersRepository<PoolClient>,
    @inject('PostgresConnection') private database: PostgresConnection,
  ) {}

  // extrai respostas de uma mensagem e salva em banco de dados com as informações do usuário
  public async execute(
    completedRegistrationForm: string,
    user: UserEntity,
    chat: ChatEntity,
  ): Promise<UsersDetailsEntity | null> {
    const connection = await this.database.getConnection();

    try {
      this.userDetailsRepository.setConnection(connection);
      this.questionsRepository.setConnection(connection);
      this.answersRepository.setConnection(connection);

      // busca questões de cadastro de um chat
      const questions = await this.questionsRepository.findByChatId(chat.id);

      if (questions === null) {
        console.log('questions não encontradas');
        return null;
      }

      // extrai respostas da mensagem do usuário
      const answerExtractor = new AnswersExtractor();
      const answers = answerExtractor.extractAnswerFromMessage(
        completedRegistrationForm,
        questions,
      );

      // cadastra as respostas do usuário
      const savedAnswers = await this.saveAnswers(user, answers);
      if (savedAnswers === null) {
        console.log('answers não registradas');
        return null;
      }

      // transforma respostas extraídas em entidade de usuário
      const userDetailsEntity = this.transformExtractAnswersIntoEntity(
        user,
        chat,
        answers,
      );

      // salva ou atualiza entidade do usuário
      const result =
        this.userDetailsRepository.createOrUpdate(userDetailsEntity);

      return result;
    } catch (error) {
      console.log(error);
      this.database.release();
      return null;
    }
  }

  private async saveAnswers(
    user: UserEntity,
    answersAndQuestions: ExtractedAnswer[],
  ): Promise<AnswerEntity[] | null> {
    try {
      const transactionResult = await this.database.transaction(
        async (newConnection) => {
          this.answersRepository.setConnection(newConnection);

          const answersToSave: Promise<AnswerEntity | null>[] =
            answersAndQuestions.map((answerAndQuestion) => {
              return this.answersRepository.create({
                idQuestion: answerAndQuestion.question.id,
                idUser: user.id,
                answer: answerAndQuestion.answer,
              });
            });

          const savedAnswers = await Promise.all(answersToSave);

          const notNullSavedAnswers = savedAnswers.filter(
            (saved): saved is AnswerEntity => saved !== null,
          );
          return notNullSavedAnswers;
        },
      );

      return transactionResult;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private transformExtractAnswersIntoEntity(
    user: UserEntity,
    chat: ChatEntity,
    extractedAnswers: ExtractedAnswer[],
  ): UsersDetailsEntity {
    const answersExtractor = new AnswersExtractor();

    const userDetailsEntity = new UsersDetailsEntity({
      idChat: chat.id,
      idUser: user.id,
      name: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.NAME,
      ),
      pronoun: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.PRONOUN,
      ),
      age: Number(
        answersExtractor.getAnswersByQuestionEnum(
          extractedAnswers,
          RegistrationQuestionsColumns.AGE,
        )!,
      ),
      location: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.LOCATION,
      ),
      sign: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.SIGN,
      ),
      sexualOrientation: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.SEXUAL_ORIENTATION,
      ),
      relationship: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.RELATIONSHIP,
      ),
      madnessForLove: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.MADNESS_FOR_LOVE,
      ),
      instagram: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.INSTAGRAM,
      ),
      photoUrl: answersExtractor.getAnswersByQuestionEnum(
        extractedAnswers,
        RegistrationQuestionsColumns.PHOTO,
      ),
    });

    return userDetailsEntity;
  }
}

export { UseCaseRegisterUserDetails };
