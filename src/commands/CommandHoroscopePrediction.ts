import { EnumValidCommands } from 'enums/Commands';
import { EnumHoroscope } from 'enums/Horoscope';
import { Horoscope } from 'models/Horoscope';
import { GroupManager } from 'services/GroupManager/GroupManager';
import { IHoroscopePrediction } from 'services/HoroscopePrediction/IHoroscopePrediction';
import { StringUtils } from 'utils/String.utils';
import { HoroscopeValidator } from 'validators/HoroscopeValidator';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandHoroscopePrediction implements ICommand {
  constructor(
    private horoscopePrediction: IHoroscopePrediction,
    private groups: GroupManager,
  ) {}

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Horoscope Predicion - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const horoscopeEnum: EnumHoroscope | null =
      this.getHoroscopeFromCommand(args);

    if (horoscopeEnum === null) {
      message.reply(
        `*Comando inválido*\n\n*.${EnumValidCommands.HOROSCOPE}* _seu-signo_`,
      );
      return;
    }

    try {
      const horoscope = this.groups.getHoroscopeById(
        message.from,
        horoscopeEnum,
      );
      const haveValidSummary = horoscope && horoscope.isValid();

      let horoscopeToReply: Horoscope | null | undefined;

      if (haveValidSummary) {
        horoscopeToReply = horoscope;
      } else {
        const horoscopePredictionMessage =
          await this.horoscopePrediction.prediction(horoscopeEnum);

        const horoscopeManager = this.groups.addHoroscope(
          message.from,
          horoscopeEnum,
          horoscopePredictionMessage,
        );

        horoscopeToReply = horoscopeManager.getHoroscopeById(horoscopeEnum);
      }

      if (horoscopeToReply !== null && horoscopeToReply !== undefined) {
        const { content, createdAt, expiresIn, sign } = horoscopeToReply;
        message.reply(
          this.formatResponse({
            content,
            createdAt: StringUtils.formatDateToString(createdAt),
            type: String(sign),
            expiresIn: StringUtils.formatDateToString(expiresIn),
          }),
        );
      }
    } catch (error) {
      console.error('Error during prediction execution:', error);
    }
  }

  public getHoroscopeFromCommand = (args: string[]): EnumHoroscope | null => {
    const sign = args.length > 0 ? args[0] : '';

    return HoroscopeValidator.getValidHoroscope(sign);
  };

  private formatResponse({
    createdAt,
    expiresIn,
    type,
    content,
  }: {
    createdAt: string;
    expiresIn: string;
    type: string;
    content: string;
  }): string {
    return (
      `Criado em: *${createdAt}*` +
      `\nPróxima atualização: *${expiresIn}*` +
      `\nTipo de resumo: *${type}*` +
      `\n\n*Resumo:*\n> ${content}`
    );
  }
}

export { CommandHoroscopePrediction };
