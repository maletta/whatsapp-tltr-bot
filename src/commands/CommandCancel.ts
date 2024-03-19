import { ITextCanceling } from '@services/TextCanceling/ITextCanceling';
import { IMessage } from '@types/augmentation';
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
      const messageQuoted: IMessage =
        (await message.getQuotedMessage()) as unknown as IMessage;

      // if (messageQuoted.type === MessageTypes.TEXT) {
      console.log('message body', message.body);
      console.log('message caption', (message as unknown as IMessage).caption);
      console.log('message quoted body', messageQuoted.body);
      console.log('message quoted caption', messageQuoted.caption);
      try {
        const userMessage = messageQuoted.body;
        const prompt = `Problematize a seguinte fala "${userMessage}" em até 2 frases e nada mais: `;
        const response = await this.textSummarize.canceling(prompt, '');

        messageQuoted
          .reply(response)
          .then((responseMessage) => responseMessage.react('🤬'));
      } catch (error) {
        console.log('Error on send Command Cancel ');
        console.log(error);
      }
      // }
    } else {
      message.reply(`Marque alguém para cancelar`);
    }
  }

  isValidType = (message: Message) => {
    return message.type === MessageTypes.TEXT;
  };
}

export { CommandCancel };
