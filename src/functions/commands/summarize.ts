import { Client, Message } from 'whatsapp-web.js';
import {} from '@deathabyss/wwebjs-sender';

import { createNonStreamingMultipartContent } from '../askVertexAi';
import { filterMessagesByHour } from '../shared';

export async function commandSummarizeMessages(
  client: Client,
  message: Message,
) {
  const chat = await message.getChat();
  const filteredMessages = await filterMessagesByHour(chat, 350);
  const messageInText = filteredMessages.map((m) => m.body).join('');

  const response = await createNonStreamingMultipartContent(messageInText);

  message.reply(response);
}
