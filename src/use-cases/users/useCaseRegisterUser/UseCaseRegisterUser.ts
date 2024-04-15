import { Message } from 'whatsapp-web.js';

type QuestionAnswer = {
  question: string;
  answer: string;
};
class UseCaseRegisterUser {
  public async handle(
    message: Message,
    questions: string[],
  ): Promise<QuestionAnswer[]> {
    const presentation = message.body;

    const answers = this.extractAnswers(presentation, questions);

    return answers;
  }

  private extractAnswers(
    message: string,
    questions: string[],
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
