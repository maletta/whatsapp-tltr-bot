import { ITextSummarize } from '@services/ITextSummarize';
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

    const promptJoke = 'conte uma piada aleatória';
    const promptFunFact = 'fale uma curiosidade aleatória sobre qualquer coisa';

    const prompt = Date.now() % 2 ? promptFunFact : promptJoke;

    const response = await this.textSummarize.summarize(prompt, '');

    message.reply(response);
  }
}

export { CommandRandomMessage };
