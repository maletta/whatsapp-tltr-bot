/* eslint-disable no-underscore-dangle */
import { IChat } from 'common/CustomTypes';
import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';

class CommandEveryone implements IMessageCommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const chat = (await message.getChat()) as unknown as IChat;
    const mentions: string[] = [];
    const responseText: string[] = [];

    if (chat.isGroup === true) {
      const participants = chat.groupMetadata.participants;
      const isAdmin = participants.some(
        ({ id, isAdmin }) =>
          `${id.user}@${id.server}` === message.author && isAdmin,
      );

      if (isAdmin) {
        participants.forEach((p) => {
          mentions.push(`${p.id.user}@c.us`);
          responseText.push(`@${p.id.user}`);
        });

        const quotedMessage = await this.getQuotedMessage(message);

        await client.sendMessage(message.from, 'Vejam todos', {
          mentions,
          quotedMessageId: quotedMessage
            ? quotedMessage.id._serialized
            : message.id._serialized,
        });
        message.react('👀');
      } else {
        message.react('😎');
        message.reply('Somente administradores podem marcar todos');
      }
    }
  }

  async getQuotedMessage(message: Message): Promise<Message | null> {
    if (message.hasQuotedMsg) {
      return message.getQuotedMessage();
    }

    return null;
  }
}

export { CommandEveryone };
