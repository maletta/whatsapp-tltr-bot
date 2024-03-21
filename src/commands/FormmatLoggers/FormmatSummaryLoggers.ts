import { TimeLimitOption } from 'enums/TimeLimit';
import { Summary } from 'models/Summary';
import { StringUtils } from 'utils/String.utils';

class FormmatSummaryLoggers {
  static formmat(
    chatName: string,
    summary: Summary,
    chatMessages: string,
  ): string {
    const { content, createdAt, key } = summary;

    const formmatedMessage = FormmatSummaryLoggers.formmatMessage(
      chatName,
      StringUtils.formatDateToString(createdAt),
      content,
      chatMessages,
      key,
    );

    return formmatedMessage;
  }

  private static formmatMessage(
    chatName: string,
    createdAt: string,
    summarizeMessage: string,
    messages: string,
    timeLimit: TimeLimitOption,
  ): string {
    // eslint-disable-next-line no-useless-concat
    return (
      `Chat name: ${chatName}` +
      `\nCreation: ${createdAt}` +
      `\nCommand type: ${timeLimit}` +
      `\n\nMessages: \n${messages}\n` +
      `\n\nSummary: \n\n${summarizeMessage}`
    );
  }

  public static formatDateForFileName = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0'); // Adiciona um zero à esquerda se o dia tiver apenas um dígito
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adiciona um zero à esquerda se o mês tiver apenas um dígito
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString().padStart(2, '0'); // Adiciona um zero à esquerda se a hora tiver apenas um dígito
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Adiciona um zero à esquerda se os minutos tiverem apenas um dígito
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Adiciona um zero à esquerda se os segundos tiverem apenas um dígito

    return `${year}-${month}-${day}_${hour}-${minutes}-${seconds}`;
  };
}

export { FormmatSummaryLoggers };
