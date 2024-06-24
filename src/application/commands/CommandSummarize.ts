import { StringUtils } from 'utils/String.utils';

import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { ITextGeneration } from 'application/services/text-generation/ITextGeneration';
import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';
import { EnumTimeLimit } from 'domain/enums/text-generation/TimeLimit';
import { TimeLimitRules } from 'domain/value_objects/TimeLimitRules';
import { UseCaseGenerateSummary } from 'application/use-cases/text-generation/generate-summary/UseCaseGenerateSummary';

class CommandSummarize implements IMessageCommand {
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

        return;
      }

      const useGenerateSummary = new UseCaseGenerateSummary(
        this.textGeneration,
      );

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
      `\nTipo de resumo: *${TimeLimitRules.translateTimeLimit(timeLimit)}*` +
      `\n\n*Resumo:*\n> ${summary}`
    );
  }
}

export { CommandSummarize };
