import { QuestionEntity } from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { RegistrationQuestionsColumns } from 'domain/enums/chats/Question';

class OrderQuestionsByEnum {
  public execute(questions: QuestionEntity[]): QuestionEntity[] {
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
        questionFound.question = this.replaceBreakingLines(
          questionFound.question,
        );
        questionsOrdered.push(questionFound);
      }
    });

    return questionsOrdered;
  }

  private replaceBreakingLines = (text: string): string => {
    return text.replace(/\\n/gm, '\n');
  };
}

export { OrderQuestionsByEnum };
