/* eslint-disable no-underscore-dangle */
import { IChat } from 'src/@types/augmentation';
import { Message, Contact, Client } from 'whatsapp-web.js';

import { filterMessagesByHour } from './shared';

async function getQuotedMessage(message: Message): Promise<Message | null> {
  if (message.hasQuotedMsg) {
    return message.getQuotedMessage();
  }

  return null;
}

export async function commandEveryOne(
  client: Client,
  message: Message,
): Promise<void> {
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
  const text = responseText.join('');
  const quotedMessage = await getQuotedMessage(message);

  console.log('mentions', mentions);
  console.log('responseText', text);

  await client.sendMessage(message.from, 'Vejam todos', {
    mentions: mentions as unknown as Contact[],
    quotedMessageId: quotedMessage
      ? quotedMessage.id._serialized
      : message.id._serialized,
  });
}

export async function commandSummarizeMessages(
  client: Client,
  message: Message,
) {
  const chat = await message.getChat();
  const filteredMessages = await filterMessagesByHour(chat, 200);

  message.reply('Mensagem');
}
