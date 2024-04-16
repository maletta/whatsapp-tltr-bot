import { EnumHoroscope } from 'domain/enums/Horoscope';
import { StringUtils } from 'utils/String.utils';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';
import { Horoscope } from 'domain/entities/text-generation/Horoscope';
import { ITextGeneration } from 'application/services/text-generation/ITextGeneration';
import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';
import { EnumPublicCommands } from 'domain/enums/Commands';
import { HoroscopeValidator } from 'domain/entities/text-generation/validators/HoroscopeValidator';

class CommandHoroscopePrediction implements ICommand {
  constructor(
    private textGeneration: ITextGeneration,
    private groups: GroupsManager,
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

    const groupId = message.from;

    if (horoscopeEnum === null) {
      message.reply(
        `*Comando inválido*\n\n*.${EnumPublicCommands.HOROSCOPE}* _seu-signo_`,
      );
      return;
    }

    try {
      const group = this.groups.findByIdOrCreate(groupId);
      const horoscopes = group.getHoroscopes();
      const horoscope = horoscopes.getItem(horoscopeEnum);

      if (horoscope?.isValid()) {
        const { content, createdAt, expiresIn } = horoscope;

        message.reply(
          this.formatResponse({
            content,
            createdAt: StringUtils.formatDateToString(createdAt),
            type: String(horoscopeEnum),
            expiresIn: StringUtils.formatDateToString(expiresIn),
          }),
        );

        return;
      }

      const horoscopePredictionMessage = await this.textGeneration.generate(
        `Faça uma breve previsão do horóscopo de hoje para o signo de ${horoscopeEnum}`,
      );

      if (
        horoscopePredictionMessage !== null &&
        horoscopePredictionMessage !== undefined
      ) {
        const horoscopeToReply = new Horoscope({
          content: horoscopePredictionMessage,
          key: horoscopeEnum,
        });

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
