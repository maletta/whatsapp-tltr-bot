import { EnumTimeLimit, TimeLimitOption } from '@enums/TimeLimit';
import { Summary } from '@models/Summary';
import { GroupManager } from '@services/GroupManager/GroupManager';
import { ILoggerFiles } from '@services/LoggerFiles/ILoggerFiles';
import { LoggerFiles } from '@services/LoggerFiles/implementation/LoggerFiles';
import { ITextSummarize } from '@services/TextSummarize/ITextSummarize';
import { TransformMessages } from '@utils/Formatters/TransformMessage';
import { TimeLimit } from '@utils/TimeLimit';
import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import { FormmatSummaryLoggers } from './FormmatLoggers/FormmatSummaryLoggers';
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

    try {
      const summary = this.groups.getSummaryById(message.from, timeLimit);
      const haveValidSummary = summary && summary.isValid();

      let summaryToReplyWith: Summary | null | undefined;

      if (haveValidSummary) {
        summaryToReplyWith = summary;
      } else {
        summaryToReplyWith = await this.createSummary(message, timeLimit);
      }

      if (summaryToReplyWith) {
        const { content, formatCreatedAt, formatExpiration, timeLimit } =
          summaryToReplyWith;

        message.reply(
          this.formatSummaryResponse(
            content,
            formatCreatedAt(),
            formatExpiration(),
            timeLimit,
          ),
        );
      } else {
        console.error('Failed to retrieve or create a valid summary');
      }
    } catch (error) {
      console.error('Error during summary execution:', error);
    }
  }

  private async createSummary(
    message: Message,
    timeLimit: TimeLimitOption,
  ): Promise<Summary | null> {
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

    let messagesToResponse: string | null | undefined = null;

    if (messagesByTokenLimit.length > 1) {
      messagesToResponse = await this.textSummarize.summarizeBatch(
        promptMock,
        messagesByTokenLimit,
      );
    } else {
      messagesToResponse = await this.textSummarize.summarize(
        promptMock,
        messagesByTokenLimit[0],
      );
    }

    if (messagesToResponse !== null || messagesToResponse !== undefined) {
      const summaryManager = this.groups.addSummary(
        message.from,
        timeLimit,
        messagesToResponse,
      );

      const newSummary = summaryManager.getSummaryById(timeLimit);

      this.logSummary(chat, newSummary, messagesByTokenLimit);

      return newSummary;
    }

    return null;
  }

  // get the number args for command summarize 30m, 1hr, 2hr, 4hr, 6hr
  public getSummarizeTimeFromCommand = (args: string[]): TimeLimitOption => {
    const firstArs = args.length > 0 ? args[0] : '';
    if (firstArs.includes('1')) return '1_HOUR';

    if (firstArs.includes('2')) return '2_HOURS';

    if (firstArs.includes('4')) return '4_HOURS';

    if (firstArs.includes('6')) return '6_HOURS';

    return '30_MINUTES';
  };

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
      `\nTipo de resumo: *${TimeLimit.translateTimeLimit(timeLimit)}*` +
      `\n\n*Resumo:*\n> ${summary}`
    );
  }

  private logSummary = (
    chat: Chat,
    summary: Summary,
    messages: string[],
  ): void => {
    const groupId = `${chat.id.user}${chat.id.server}`;
    try {
      const logger: ILoggerFiles = LoggerFiles.getInstance();
      const formmatSummaryLoggers = FormmatSummaryLoggers.formmat(
        chat.name,
        summary,
        messages.join('\n\n------TokenLimit----\n\n'),
      );
      const fileName = FormmatSummaryLoggers.formatDateForFileName(
        summary.createdAt,
      );

      logger.log(groupId, fileName, formmatSummaryLoggers);
    } catch (error) {
      console.log(`Error on save summary log file. Group id ${groupId}`);
      console.log(error);
    }
  };
}

export { CommandSummarize };
