import { RegistrationQuestionsColumns } from 'domain/enums/chats/Question';

interface IQuestionEntity {
  id: number;
  idChat: number;
  question: string;
  questionColumnType: RegistrationQuestionsColumns;
}

type QuestionDTO = Omit<IQuestionEntity, 'id'>;

class QuestionEntity {
  public readonly id: number;
  public readonly idChat: number;
  public question: string;
  public questionColumnType: RegistrationQuestionsColumns;
  constructor(question: IQuestionEntity) {
    this.id = question.id;
    this.idChat = question.idChat;
    this.question = question.question;
    this.questionColumnType = question.questionColumnType;
  }
}

interface IAnswerEntity {
  id: number;
  idQuestion: number;
  idUser: number;
  answer: string;
}

type AnswerDTO = Omit<IAnswerEntity, 'id'>;

class AnswerEntity {
  public readonly id: number;
  public readonly idQuestion: number;
  public idUser: number;
  public answer: string;

  constructor(answer: IAnswerEntity) {
    this.id = answer.id;
    this.idQuestion = answer.idQuestion;
    this.idUser = answer.idUser;
    this.answer = answer.answer;
  }
}

export { QuestionEntity, AnswerEntity };
export type { QuestionDTO, AnswerDTO, IQuestionEntity, IAnswerEntity };
