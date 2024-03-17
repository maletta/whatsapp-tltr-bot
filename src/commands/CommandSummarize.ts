import { GroupManager } from '@controller/GroupManager';
import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import {
  brasilIndependence,
  deathNoteMock,
  dragonBallZMock,
  fullMetalAlchemistMock,
  narutoMock,
  onePieceMock,
} from '../mocks/animesMock';
import { createMessageMock } from '../mocks/messagesMock';
import { EnumTimeLimit } from '../model/TimeLimit';
import { ITextSummarize } from '../services/ITextSummarize';
import { concatMessages } from '../utils/shared';
import { ICommand } from './ICommand';

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

    const chat = await message.getChat();
    const filteredMessages = await this.filterMessagesByHour(
      chat,
      EnumTimeLimit[timeLimit],
      3000,
    );

    const messagesByTokenLimit = this.createBatchOfMessages(filteredMessages, {
      maxTokens: 14000,
    });

    console.log('Time limit ', timeLimit);

    console.log('messagesByTokenLimit', messagesByTokenLimit.length);

    const promptMock = `Organize detalhadamente os tópicos abrangidos nessas conversas:`;

    const messagesToResponse: string[] = [];

    if (messagesByTokenLimit.length > 1) {
      const response = await this.textSummarize.summarizeBatch(
        promptMock,
        messagesByTokenLimit,
      );

      messagesToResponse.concat(response);
    } else {
      const response = await this.textSummarize.summarize(
        promptMock,
        messagesByTokenLimit[0],
      );

      messagesToResponse.push(response);
    }

    const summaryManager = this.groups.addSummary(
      message.from,
      timeLimit,
      messagesToResponse.join('\n\n'),
    );

    const newSummary = summaryManager.getSummaryById(timeLimit);

    message.reply(
      this.formatSummaryResponse(
        newSummary.content,
        newSummary.formatCreatedAt(),
        newSummary.formatExpiration(),
        timeLimit,
      ),
    );
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

  private createBatchOfMessages(
    messages: Message[],
    { maxTokens = 10000 } = {},
  ): string[] {
    const messagesBatches = [];
    let currentString = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < messages.length; i++) {
      const msg = this.removeMentionsAndCommands(messages[i].body); // Supondo que 'body' é a propriedade que contém o texto da mensagem

      // Verifica se a adição da próxima mensagem excederá o limite de 3800 caracteres
      if (currentString.length + msg.length > maxTokens) {
        // Se exceder, adiciona a string atual ao array de mensagens concatenadas
        messagesBatches.push(currentString);
        // Começa uma nova string com a mensagem atual
        currentString = msg;
      } else {
        // Se não exceder, adiciona a mensagem à string atual
        currentString += msg;
      }
    }

    // Adiciona a última string ao array de mensagens concatenadas
    if (currentString !== '') {
      messagesBatches.push(currentString);
    }

    return messagesBatches;
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
