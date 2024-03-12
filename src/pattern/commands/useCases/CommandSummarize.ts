import { createNonStreamingMultipartContent } from 'src/functions/askVertexAi';
import { filterMessagesByHour } from 'src/functions/shared';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from '../ICommand';

class CommandSummarize implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const chat = await message.getChat();
    const filteredMessages = await filterMessagesByHour(chat, 350);
    const messageInText = filteredMessages.map((m) => m.body).join('');

    const response = await createNonStreamingMultipartContent(messageInText);

    message.reply(response);
  }
}

export { CommandSummarize };
