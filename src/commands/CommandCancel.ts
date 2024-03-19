import { ITextCanceling } from '@services/TextCanceling/ITextCanceling';
import { Client, Message, MessageTypes } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandCancel implements ICommand {
  private textSummarize: ITextCanceling;

  constructor(textSummarize: ITextCanceling) {
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
        console.log('message ', message);
        console.log('message quoted', messageQuoted);
        const prompt = `Problematize a seguinte fala em até 2 frases e nada mais: `;
        try {
          const response = await this.textSummarize.canceling(
            prompt,
            messageQuoted.body,
          );

          messageQuoted.reply(response);
        } catch (error) {
          console.log('Error on send Command Cancel ');
          console.log(error);
        }
      }
    } else {
      message.reply(`Marque uma mensagem para cancelar`);
    }
  }
}

export { CommandCancel };
