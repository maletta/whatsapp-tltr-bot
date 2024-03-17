import { GroupManager } from '@model/GroupManager';
import { Summary } from '@model/Summary';
import { EnumTimeLimit, TimeLimit, TimeLimitOption } from '@model/TimeLimit';
import { ITextSummarize } from '@services/ITextSummarize';
import { TransformMessages } from '@utils/Formatters/TransformMessage';
import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

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

      return;
    }

    try {
      const newSummary = await this.createSummary(message, timeLimit);

      message.reply(
        this.formatSummaryResponse(
          newSummary.content,
          newSummary.formatCreatedAt(),
          newSummary.formatExpiration(),
          timeLimit,
        ),
      );
    } catch (error) {
      console.log('Error on create new Summary');
      console.log(error);
    }
  }

  private async createSummary(
    message: Message,
    timeLimit: TimeLimitOption,
  ): Promise<Summary> {
    const chat = await message.getChat();
    const filteredMessages = await this.filterMessagesByHour(
      chat,
      EnumTimeLimit[timeLimit],
      3000,
    );

    const messagesByTokenLimit = TransformMessages.createBatchOfMessages(
      filteredMessages,
      {
        maxTokens: 14000,
      },
    );

    console.log('Time limit ', timeLimit);

    console.log('messagesByTokenLimit', messagesByTokenLimit.length);

    const promptMock = `Aqui está uma lista de mensagens trocadas por usuários que estão separadas por ';'.
    Organize e detalhe os assuntos abrangidos nessas conversas:`;

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

    return newSummary;
  }

  // get the number args for command summarize 30m, 1hr, 2hr, 4hr, 6hr
  public getSummarizeTimeFromCommand(args: string[]): TimeLimitOption {
    const firstArs = args.length > 0 ? args[0] : '';
    if (firstArs.includes('1')) return '1_HOUR';

    if (firstArs.includes('2')) return '2_HOURS';

    if (firstArs.includes('4')) return '4_HOURS';

    if (firstArs.includes('6')) return '6_HOURS';

    return '30_MINUTES';
  }

  public async filterMessagesByHour(
    chat: Chat,
    timeLimit: EnumTimeLimit,
    limit: number = 1000,
  ): Promise<Message[]> {
    const allMessages: Message[] = await chat
      .fetchMessages({
        limit,
        fromMe: false,
      })
      .then((foundMessages) => {
        return foundMessages.filter(
          (msg) =>
            msg.type === MessageTypes.TEXT &&
            TimeLimit.isBetweenTimeLimit(msg.timestamp, timeLimit),
        );
      });

    return allMessages;
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
      `\n\n*Resumo:*\n> ${summary}`
    );
  }
}

export { CommandSummarize };
