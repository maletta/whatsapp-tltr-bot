import {
  ExtractedAnswer,
  QuestionEntity,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { RegistrationQuestionsColumns } from 'domain/enums/chats/Question';

class AnswersExtractor {
  // lê o formulário de respostas do usuário e as questões cadastradas no BD para o chat
  // retorna um array de objetos com as perguntas e as respostas
  public extractAnswerFromMessage(
    message: string,
    questions: QuestionEntity[],
  ): ExtractedAnswer[] {
    const answers: ExtractedAnswer[] = [];

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

  public getAnswersByQuestionEnum(
    extractedAnswer: ExtractedAnswer[],
    questionEnum: RegistrationQuestionsColumns,
  ): string | null {
    const questionFound = extractedAnswer.find(
      ({ question }) => question.questionColumnType === questionEnum,
    );
    if (questionFound === undefined) {
      return null;
    }

    return questionFound.answer;
  }

  private normalizeString(str: string): string {
    return str
      .replace(/[^a-zA-ZÀ-ÿ0-9\s()@#\/\\\-_<>]/g, '') // ^ nega a correspondência
      .trim();
  }
}

export { AnswersExtractor };
