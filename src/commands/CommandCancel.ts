import { ITextSummarize } from '@services/TextSummarize/ITextSummarize';
import { Client, Message, MessageTypes } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandCancel implements ICommand {
  private textSummarize: ITextSummarize;

  constructor(textSummarize: ITextSummarize) {
    this.textSummarize = textSummarize;
  }

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Cancel Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    if (message.hasQuotedMsg) {
      const messageQuoted = await message.getQuotedMessage();

      if (messageQuoted.type === MessageTypes.TEXT) {
        const prompt = `Problematize a seguinte fala em até 2 frases e nada mais: "${messageQuoted.body}" `;
        try {
          const response = await this.textSummarize.summarize(prompt, '');

          message.reply(response);
        } catch (error) {
          console.log('Error on send Command Cancel ');
          console.log(error);
        }
      }
    }
  }
}

export { CommandCancel };
