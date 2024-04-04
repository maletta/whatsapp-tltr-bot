import { EnumTimeLimit } from 'enums/TimeLimit';
import { Summary } from 'models/Summary';
import { GroupsManager } from 'services/GroupManager/GroupsManager';
import { GroupState } from 'services/GroupManager/GroupState';
import { ITextGeneration } from 'services/TextGeneration/ITextGeneration';
import { UseGenerateSummary } from 'src/useCases/summary/useGenerateSummary/UseGenerateSummary';
import { StringUtils } from 'utils/String.utils';
import { TimeLimit } from 'utils/TimeLimit';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandSummarize implements ICommand {
  constructor(
    private textGeneration: ITextGeneration,
    private groups: GroupsManager,
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

    const groupId = message.from;

    try {
      const group = this.groups.findByIdOrCreate(groupId);
      const summaries = group.getSummaries();
      const summary = summaries.getItem(timeLimit);
      const haveValidSummary = summary?.isValid();

      if (summary && haveValidSummary) {
        const { content, createdAt, expiresIn } = summary;

        message.reply(
          this.formatSummaryResponse(
            content,
            StringUtils.formatDateToString(createdAt),
            StringUtils.formatDateToString(expiresIn),
            timeLimit,
          ),
        );
      }

      const useGenerateSummary = new UseGenerateSummary(this.textGeneration);

      const summaryToReplyWith = await useGenerateSummary.execute(
        message,
        timeLimit,
      );

      if (summaryToReplyWith) {
        const {
          content,
          createdAt,
          key: timeLimit,
          expiresIn,
        } = summaryToReplyWith;

        summaries.addItem(timeLimit, summaryToReplyWith);

        message.reply(
          this.formatSummaryResponse(
            content,
            StringUtils.formatDateToString(createdAt),
            StringUtils.formatDateToString(expiresIn),
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

  // get the number args for command summarize 30m, 1hr, 2hr, 4hr, 6hr
  public getSummarizeTimeFromCommand = (args: string[]): EnumTimeLimit => {
    const firstArs = args.length > 0 ? args[0] : '';
    if (firstArs.includes('1')) return EnumTimeLimit['1_HOUR'];

    if (firstArs.includes('2')) return EnumTimeLimit['2_HOURS'];

    if (firstArs.includes('4')) return EnumTimeLimit['4_HOURS'];

    if (firstArs.includes('6')) return EnumTimeLimit['6_HOURS'];

    return EnumTimeLimit['30_MINUTES'];
  };

  private formatSummaryResponse(
    summary: string,
    createdAt: string,
    expiresIn: string,
    timeLimit: EnumTimeLimit,
  ): string {
    return (
      `Criado em: *${createdAt}*` +
      `\nPróxima atualização: *${expiresIn}*` +
      `\nTipo de resumo: *${TimeLimit.translateTimeLimit(timeLimit)}*` +
      `\n\n*Resumo:*\n> ${summary}`
    );
  }
}

export { CommandSummarize };
