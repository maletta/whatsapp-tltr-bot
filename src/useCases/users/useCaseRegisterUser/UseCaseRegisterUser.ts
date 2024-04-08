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

    for (const line of lines) {
      // Se a linha atual contém a pergunta
      if (line.includes(questions[currentQuestionIndex])) {
        // Extrai resposta reomvendo a pergunta
        const answer = line.replace(questions[currentQuestionIndex], '').trim();

        answers.push({
          question: questions[currentQuestionIndex],
          answer: answer,
        });

        // Passa para próxima pergunta
        currentQuestionIndex++;
      }

      // Se todas as perguntas foram respondidas, sai do loop
      if (currentQuestionIndex >= questions.length) break;
    }

    return answers;
  }
}

export { UseCaseRegisterUser };
