import { EnumValidCommands } from 'enums/Commands';
import { EnumHoroscope } from 'enums/Horoscope';
import { Horoscope } from 'models/Horoscope';
import { GroupsManager } from 'services/GroupManager/GroupsManager';
import { GroupState } from 'services/GroupManager/GroupState';
import { ITextGeneration } from 'services/TextGeneration/ITextGeneration';
import { StringUtils } from 'utils/String.utils';
import { HoroscopeValidator } from 'validators/HoroscopeValidator';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandHoroscopePrediction implements ICommand {
  constructor(
    private textGeneration: ITextGeneration,
    private groups: GroupsManager,
  ) { }

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

    const groupId = message.from;

    if (horoscopeEnum === null) {
      message.reply(
        `*Comando inválido*\n\n*.${EnumValidCommands.HOROSCOPE}* _seu-signo_`,
      );
      return;
    }

    try {
      const group = this.groups.findById(groupId);
      const horoscopes = group.getHoroscopes();
      const horoscope = horoscopes.getItem(horoscopeEnum);
      const haveValidHoroscope = horoscope.isValid();

      let horoscopeToReply: Horoscope | null | undefined = null;

      if (haveValidHoroscope) {
        horoscopeToReply = horoscope;
      } else {
        const horoscopePredictionMessage = await this.textGeneration.generate(
          `Faça uma breve previsão do horóscopo de hoje para o signo de ${horoscopeEnum}`,
        );

        // if horoscope predictions message is not null; but we need throw error and not null
        if (horoscopePredictionMessage) {
          horoscopeToReply = new Horoscope({
            content: horoscopePredictionMessage,
            key: horoscopeEnum,
          });
        }
      }

      if (horoscopeToReply !== null && horoscopeToReply !== undefined) {
        horoscopes.addItem(horoscopeEnum, horoscopeToReply);

        const { content, createdAt, expiresIn, key: sign } = horoscopeToReply;
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
      `\nSigno: *${type}*` +
      `\n\n*Resumo:*\n> ${content}`
    );
  }
}

export { CommandHoroscopePrediction };
