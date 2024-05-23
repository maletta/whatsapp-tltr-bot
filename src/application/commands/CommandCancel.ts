import { ITextGeneration } from 'application/services/text-generation/ITextGeneration';
import { IMessage } from 'common/CustomTypes';
import { Client, Message, MessageTypes } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';

class CommandCancel implements IMessageCommand {
  private textGeneration: ITextGeneration;

  constructor(textGeneration: ITextGeneration) {
    this.textGeneration = textGeneration;
  }

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    if (!message.hasQuotedMsg) {
      message.reply(`Marque uma mensagem para cancelar`);
      return;
    }

    const messageQuoted: IMessage =
      (await message.getQuotedMessage()) as unknown as IMessage;

    if (messageQuoted.id.fromMe) {
      message.reply(`Miau, estou corretíssimo!`);
      return;
    }

    console.log('message body', message.body);
    console.log('message caption', (message as unknown as IMessage).caption);
    console.log('message quoted body', messageQuoted.body);
    console.log('message quoted caption', messageQuoted.caption);

    try {
      const userMessage = messageQuoted.body;
      const prompt = `Problematize a seguinte fala "${userMessage}" em até 2 frases e nada mais: `;
      const response = await this.textGeneration.generate(prompt);

      if (response) {
        messageQuoted.reply(response);
        messageQuoted.react('🤬');
      }
    } catch (error) {
      console.log('Error on send Command Cancel ');
      console.log(error);
    }
  }

  private isValidType = (message: Message) => {
    return message.type === MessageTypes.TEXT;
  };
}

export { CommandCancel };
