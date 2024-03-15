import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import {
  brasilIndependence,
  deathNoteMock,
  dragonBallZMock,
  fullMetalAlchemistMock,
  narutoMock,
  onePieceMock,
} from '../../../mocks/animesMock';
import { createMessageMock } from '../../../mocks/messagesMock';
import { concatMessages } from '../../../utils/shared';
import { GroupManager } from '../../mediator/GroupManager';
import { EnumTimeLimit } from '../../model/TimeLimit';
import { ITextSummarize } from '../../services/ITextSummarize';
import { ICommand } from '../ICommand';

class CommandSummarize implements ICommand {
  constructor(
    private textSummarize: ITextSummarize,
    private groups: GroupManager,
  ) {}

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const timeLimit = this.getSummarizeTimeFromCommand(args);

    console.log('Command Summarize - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    console.log('from ', message.from);
    const summary = this.groups.getSummaryById(message.from, timeLimit);
    const haveValidSummary = summary && summary.isValid();

    if (haveValidSummary) {
      const { content, formatCreatedAt, formatExpiration, timeLimit } = summary;
      message.reply(
        this.formatSummaryResponse(
          content,
          formatCreatedAt(),
          formatExpiration(),
          timeLimit,
        ),
      );
    }

    // const chat = await message.getChat();
    // const filteredMessages = await this.filterMessagesByHour(
    //   chat,
    //   EnumTimeLimit[timeLimit],
    //   1000,
    // );
    // const messageJoin = filteredMessages.map((m) => m.body).join();
    // const messageFormatted = this.removeMentionsAndCommands(messageJoin);

    console.log('Time limit ', timeLimit);

    // console.log(messageFormatted);

    // const test = await this.filterMessagesByHour(
    //   chat,
    //   EnumTimeLimit['6_HOURS'],
    //   100,
    // ).then((message) => message.map((msg) => msg.body));
    // console.log('--- messages join ');
    // console.log(this.removeMentionsAndCommands(test.join()));

    // const prompt = `Resuma as mensagens dessa conversa em tópicos dos assuntos abrangidos pelas pessoas: ${messagesToSummarize}`;

    // const response = await this.textSummarize.summarize(prompt);

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

  private formatSummaryResponse(
    summary: string,
    createdAt: string,
    expiresIn: string,
    timeLimit: keyof typeof EnumTimeLimit,
  ): string {
    return (
      `Criado em: *${createdAt}*` +
      `\nPróxima atualização: *${expiresIn}*` +
      `\nTipo de resumo: *${EnumTimeLimit[timeLimit]}*` +
      `\n*Resumo:*\n> ${summary}`
    );
  }
  private async testMessages(): Promise<string[]> {
    const messagesMock: string[] = [
      narutoMock,
      onePieceMock,
      fullMetalAlchemistMock,
      dragonBallZMock,
      deathNoteMock,
      brasilIndependence,
    ];

    const messagesMountedMock: Message[] = messagesMock.map((m) =>
      createMessageMock(m),
    );

    const messagesByTokenLimit: string[] = concatMessages(messagesMountedMock, {
      maxTokens: 14000,
    });

    console.log('messagesByTokenLimit', messagesByTokenLimit.length);

    const promptMock = `Organize detalhadamente os tópicos abrangidos nessas conversas:`;

    const response = await this.textSummarize.summarizeBatch(
      promptMock,
      messagesByTokenLimit,
    );

    return response;
  }
}

export { CommandSummarize };
