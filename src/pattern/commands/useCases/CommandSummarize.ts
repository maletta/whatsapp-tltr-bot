import { createNonStreamingMultipartContent } from 'src/functions/askVertexAi';
import { EnumTimeLimit } from 'src/pattern/model/TimeLimit';
import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import { ICommand } from '../ICommand';

class CommandSummarize implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const timeLimit = this.getSummarizeTimeFromCommand(args);

    const chat = await message.getChat();
    const filteredMessages = await this.filterMessagesByHour(
      chat,
      EnumTimeLimit[timeLimit],
      500,
    );
    const messageInText = filteredMessages.map((m) => m.body).join('');

    const response = await createNonStreamingMultipartContent(messageInText);

    message.reply(response);
  }

  // get the number args for command summarize
  // 1hr, 2hr, 4hr, 6hr
  private getSummarizeTimeFromCommand(
    args: string[],
  ): keyof typeof EnumTimeLimit {
    if (args.includes('1')) return '1_HOUR';

    if (args.includes('2')) return '2_HOURS';

    if (args.includes('4')) return '4_HOURS';

    if (args.includes('6')) return '6_HOURS';

    return '30_MINUTES';
  }

  private async filterMessagesByHour(
    chat: Chat,
    timeLimit: EnumTimeLimit,
    limit: number = 500,
  ): Promise<Message[]> {
    const allMessages: Message[] = await chat
      .fetchMessages({
        limit,
      })
      .then((foundMessages) => {
        return foundMessages.filter(
          (msg) =>
            msg.type === MessageTypes.TEXT &&
            this.isBetweenTimeLimit(msg.timestamp, timeLimit),
        );
      });

    return allMessages;
  }

  // valid if  timestamp is between start and end of given time limit
  private isBetweenTimeLimit(timestamp: number, timeLimit: EnumTimeLimit) {
    const now = Date.now();
    return now - new Date(timestamp * 1000).getTime() <= timeLimit * 1000;
  }
}

export { CommandSummarize };
