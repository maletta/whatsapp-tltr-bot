import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import { createNonStreamingMultipartContent } from '../../../functions/askVertexAi';
import { EnumTimeLimit } from '../../model/TimeLimit';
import { ICommand } from '../ICommand';

class CommandSummarize implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const timeLimit = this.getSummarizeTimeFromCommand(args);

    console.log('Command Summarize - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const chat = await message.getChat();
    const filteredMessages = await this.filterMessagesByHour(
      chat,
      EnumTimeLimit[timeLimit],
      500,
    );
    const messageInText = filteredMessages.map((m) => m.body).join('');

    const prompt =
      'Resuma as mensagens dessa conversa em tópicos dos assuntos mais relevantes: ';

    const response = await createNonStreamingMultipartContent(
      prompt,
      messageInText,
    );

    message.reply(response);
  }

  // get the number args for command summarize
  // 1hr, 2hr, 4hr, 6hr
  public getSummarizeTimeFromCommand(
    args: string[],
  ): keyof typeof EnumTimeLimit {
    if (args.includes('1')) return '1_HOUR';

    if (args.includes('2')) return '2_HOURS';

    if (args.includes('4')) return '4_HOURS';

    if (args.includes('6')) return '6_HOURS';

    return '30_MINUTES';
  }

  public async filterMessagesByHour(
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
  public isBetweenTimeLimit(timestamp: number, timeLimit: EnumTimeLimit) {
    const now = Date.now();
    return now - new Date(timestamp * 1000).getTime() <= timeLimit * 1000;
  }
}

export { CommandSummarize };
