import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { ITextGeneration } from 'application/services/text-generation/ITextGeneration';

class CommandRandomMessage implements IMessageCommand {
  private textGeneration: ITextGeneration;

  constructor(textGeneration: ITextGeneration) {
    this.textGeneration = textGeneration;
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
      'Quero um bordão ou frase para um personagem de um livro. O contexto é que você é um personagem gato robo em um grupo de amigos e em uma conversa lhe foi solicitado para dizer algo. Mas você está cansado de responder e das falas das pessoas. Seja muito breve e grosseiro. Me mande somente uma frase para usar.';

    const promptFlirtResponse =
      "Quero um bordão ou frase para um personagem de um livro. O contexto é que você é um personagem gato robo em um grupo de amigos e em uma conversa lhe foi solicitado para dizer algo. Mas você sem querer corteja uma pessoa em que estava pensando. Seja muito breve e criativo. Me mande somente uma frase  que é a sua cantada';";
    let prompt;

    switch (randomNumber) {
      case 1:
        prompt = promptBadResponse;
        break;
      case 2:
        prompt =
          'O contexto é que  você é um gato robô, me envie uma curiosidade aleatória sobre qualquer coisa';
        break;
      case 3:
        prompt = promptBadResponse;
        break;
      case 4:
        prompt = promptFlirtResponse;
        break;
      case 5:
        prompt = 'envie  uma citação famosa e o author';
        break;
      default:
        prompt = promptBadResponse;
    }

    const response = await this.textGeneration.generate(prompt);

    if (response === null) {
      message.reply('Agora não quero responder, miau');
      return;
    }

    message.reply(response);
  }
}

export { CommandRandomMessage };
