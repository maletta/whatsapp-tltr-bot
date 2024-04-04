import { FormmatSummaryLoggers } from 'commands/FormmatLoggers/FormmatSummaryLoggers';
import { EnumTimeLimit } from 'enums/TimeLimit';
import { Summary } from 'models/Summary';
import { ILoggerFiles } from 'services/LoggerFiles/ILoggerFiles';
import { LoggerFiles } from 'services/LoggerFiles/implementation/LoggerFiles';
import { ITextGeneration } from 'services/TextGeneration/ITextGeneration';
import { TransformMessages } from 'utils/Formatters/TransformMessage';
import { TimeLimit } from 'utils/TimeLimit';
import { Chat, Message, MessageTypes } from 'whatsapp-web.js';

class UseGenerateSummary {
  constructor(private textGeneration: ITextGeneration) {}

  public async execute(
    message: Message,
    timeLimit: EnumTimeLimit,
  ): Promise<Summary | null> {
    const chat = await message.getChat();

    const filteredMessages = await this.getFilteredMessage(chat, timeLimit);

    const generatedText = await this.generateSummary(
      filteredMessages,
      timeLimit,
    );

    if (generatedText === null && generatedText === undefined) {
      return null;
    }

    const summary = new Summary({
      content: generatedText,
      key: timeLimit,
    });

    this.logSummary(chat, summary, filteredMessages);

    return summary;
  }

  private async generateSummary(
    messages: string[],
    timeLimit: EnumTimeLimit,
  ): Promise<string | null> {
    console.log('Time limit ', timeLimit);

    const promptMock = `Leia esse conjunto json de mensagens enviadas em grupo do whatsapp. Cada conjunto é composto pelo atributo userId que disintgue o usuário, pelo atributo timestamp que representa o horário de envio da mensagem e pelo atributo body que representa a mensagem enviada. Me diga o que foi conversado em tópicos, mas mantenha sigilo sobre a identidade do usuário : `;

    let messagesToResponse: string | null | undefined = null;

    if (messages.length > 1) {
      messagesToResponse = await this.textGeneration.generateBatch(
        promptMock,
        messages,
      );
    } else {
      messagesToResponse = await this.textGeneration.generate(
        `${promptMock} ${messages[0]}`,
      );
    }

    if (messagesToResponse === null || messagesToResponse === undefined) {
      throw new Error('Generated summary is empty');
    }

    return messagesToResponse;
  }

  private async getFilteredMessage(
    chat: Chat,
    timeLimit: EnumTimeLimit,
  ): Promise<string[]> {
    const filteredMessages = await this.filterMessagesByHour(
      chat,
      timeLimit,
      3000,
    );

    const messagesByTokenLimit = TransformMessages.createBatchOfMessages(
      filteredMessages,
      {
        maxTokens: 14000,
      },
    );
    console.log('messagesByTokenLimit', messagesByTokenLimit.length);

    return messagesByTokenLimit;
  }

  private async filterMessagesByHour(
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

export { UseGenerateSummary };
