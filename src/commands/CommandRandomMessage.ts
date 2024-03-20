import { ITextSummarize } from 'services/TextSummarize/ITextSummarize';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandRandomMessage implements ICommand {
  private textSummarize: ITextSummarize;

  constructor(textSummarize: ITextSummarize) {
    this.textSummarize = textSummarize;
  }

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Random Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const randomNumber = Math.floor(Math.random() * 5) + 1;

    const promptBadResponse =
      'Quero um bordão ou frase para um personagem de um livro. O contexto é que você é um personagem robo em um grupo de amigos e em uma conversa lhe foi solicitado para dizer algo. Mas você está cansado de responder e das falas das pessoas. Seja muito breve e grosseiro. Me mande somente uma frase para usar.';

    const promptFlirtResponse =
      "Quero um bordão ou frase para um personagem de um livro. O contexto é que você é um personagem robo em um grupo de amigos e em uma conversa lhe foi solicitado para dizer algo. Mas você sem querer corteja uma pessoa em que estava pensando. Seja muito breve e criativo. Me mande somente uma frase  que é a sua cantada';";
    let prompt;

    switch (randomNumber) {
      case 1:
        prompt = promptBadResponse;
        break;
      case 2:
        prompt = 'fale uma curiosidade aleatória sobre qualquer coisa';
        break;
      case 3:
        prompt = promptBadResponse;
        break;
      case 4:
        prompt = promptFlirtResponse;
        break;
      case 5:
        prompt = 'mande uma citação famosa e o author';
        break;
      default:
        prompt = promptBadResponse;
    }

    const response = await this.textSummarize.summarize(prompt, '');

    message.reply(response);
  }
}

export { CommandRandomMessage };
