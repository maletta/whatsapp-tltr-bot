import { ITextSummarize } from '@services/TextSummarize/ITextSummarize';
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

    let prompt;

    switch (randomNumber) {
      case 1:
        prompt =
          'O contexto é que você  é bot para um grupo do whatsapp e lhe foi solicitado para dizer algo aleatório. Mas você está cansado de responder e ler mensagens das pessoas. Seja muito breve e grosseiro.';
        break;
      case 2:
        prompt = 'fale uma curiosidade aleatória sobre qualquer coisa';
        break;
      case 3:
        prompt =
          'O contexto é que você  é bot para um grupo do whatsapp e lhe foi solicitado para dizer algo aleatório. Mas você está cansado de responder e ler mensagens das pessoas. Seja muito breve e grosseiro.';
        break;
      case 4:
        prompt = 'mande um elogio criativo e  emotes se quiser e nada mais';
        break;
      case 5:
        prompt = 'mande uma citação famosa e o author';
        break;
      default:
        prompt = 'me manda algo aleatório e nada mais';
    }

    const response = await this.textSummarize.summarize(prompt, '');

    message.reply(response);
  }
}

export { CommandRandomMessage };
