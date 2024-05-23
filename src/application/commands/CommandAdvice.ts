import { ITextGeneration } from 'application/services/text-generation/ITextGeneration';
import { IMessage } from 'common/CustomTypes';
import { Client, Message, MessageTypes } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';

class CommandAdvice implements IMessageCommand {
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
      message.reply(`Marque uma mensagem para aconselhar`);
      return;
    }

    const messageQuoted: IMessage =
      (await message.getQuotedMessage()) as unknown as IMessage;

    if (messageQuoted.id.fromMe) {
      message.reply(`Eu não preciso de mais conselhos!`);
      return;
    }

    try {
      const userMessage = messageQuoted.body;
      const prompt = `Aconselhe a seguinte fala "${userMessage}" em até 2 frases e nada mais: `;
      const response = await this.textGeneration.generate(prompt);

      if (response) {
        messageQuoted.reply(response);
        messageQuoted.react('🩺');
      }
    } catch (error) {
      console.log('Error on send Command Advice ');
      console.log(error);
    }
  }
}

export { CommandAdvice };
