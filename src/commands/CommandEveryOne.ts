/* eslint-disable no-underscore-dangle */
import { Client, Contact, Message } from 'whatsapp-web.js';

import { IChat } from '../@types/augmentation';
import { ICommand } from './ICommand';

class CommandEveryone implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Every One - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const chat = (await message.getChat()) as unknown as IChat;
    const mentions: string[] = [];
    const responseText: string[] = [];

    if (chat.isGroup === true) {
      const paricipants = chat.groupMetadata.participants;

      paricipants.forEach((p) => {
        mentions.push(`${p.id.user}@c.us`);
        responseText.push(`@${p.id.user}`);
      });
    }
    //   const text = responseText.join('');
    const quotedMessage = await this.getQuotedMessage(message);

    await client.sendMessage(message.from, 'Vejam todos', {
      mentions: mentions as unknown as Contact[],
      quotedMessageId: quotedMessage
        ? quotedMessage.id._serialized
        : message.id._serialized,
    });
  }

  async getQuotedMessage(message: Message): Promise<Message | null> {
    if (message.hasQuotedMsg) {
      return message.getQuotedMessage();
    }

    return null;
  }
}

export { CommandEveryone };
