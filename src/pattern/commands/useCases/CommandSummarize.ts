import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

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
      1000,
    );
    const messageJoin = filteredMessages.map((m) => m.body).join();
    const messageFormatted = this.removeMentionsAndCommands(messageJoin);

    console.log('Time limit ', timeLimit);

    console.log(messageFormatted);

    // const test = await this.filterMessagesByHour(
    //   chat,
    //   EnumTimeLimit['6_HOURS'],
    //   100,
    // ).then((message) => message.map((msg) => msg.body));
    // console.log('--- messages join ');
    // console.log(this.removeMentionsAndCommands(test.join()));

    // const prompt =
    //   'Resuma as mensagens dessa conversa em tópicos dos assuntos abrangidos pelas pessoas: ';

    // const response = await createNonStreamingMultipartContent(
    //   prompt,
    //   messageInText,
    // );

    // message.reply(response);
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
    limit: number = 1000,
  ): Promise<Message[]> {
    console.log('filterMessagesByHour ', 'limit ', limit);
    const allMessages: Message[] = await chat
      .fetchMessages({
        limit,
        fromMe: false,
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
    const timestampMilli = new Date(timestamp * 1000); // converte para milissegundos
    const agora = Date.now();

    const diffInMilli = agora - timestampMilli.getTime();
    const diffInMinutes = Math.floor(diffInMilli / 60000);

    console.log(
      'diff minutes ',
      diffInMinutes,
      'timelimite ',
      timeLimit,
      diffInMinutes < timeLimit,
    );
    return diffInMinutes < timeLimit;
  }

  private removeMentionsAndCommands(message: string): string {
    return message.replace(/[@!]\w+/g, '');
  }
}

export { CommandSummarize };
