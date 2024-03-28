import { CommandCancel } from 'commands/CommandCancel';
import { CommandEveryone } from 'commands/CommandEveryOne';
import { CommandHandler } from 'commands/CommandHandle';
import { CommandHoroscopePrediction } from 'commands/CommandHoroscopePrediction';
import { CommandInvalid } from 'commands/CommandInvalid';
import { CommandPresentation } from 'commands/CommandPresentation';
import { CommandRandomMessage } from 'commands/CommandRandomMessage';
import { CommandStickerImage } from 'commands/CommandStickerImage';
import { CommandSummarize } from 'commands/CommandSummarize';
import { BotConfiguration } from 'config/Configuration';
import { EnumSystemCommands, EnumValidCommands } from 'enums/Commands';
import { GroupManager } from 'services/GroupManager/GroupManager';
import { TextGenerationHttp } from 'services/TextGeneration/implementation/TextGenerationHttp';
import { StringUtils } from 'utils/String.utils';
import { Client, Contact, Message } from 'whatsapp-web.js';

// type ValidCommandOptions = keyof typeof EnumValidCommands;

type IBotMediatorDTO = {
  prefix: string;
};
class BotMediator {
  public groups: GroupManager;
  private commandHandler: CommandHandler;
  private prefix: string;
  private client: Client;
  private me: Contact | undefined | null;

  constructor(client: Client, args: Partial<IBotMediatorDTO> = {}) {
    this.prefix = args.prefix || '.';
    this.groups = new GroupManager();
    this.commandHandler = new CommandHandler();
    this.client = client;

    this.registerCommands();
  }

  private registerCommands(): void {
    this.commandHandler.registerCommand(
      EnumValidCommands.SUMMARIZE,
      new CommandSummarize(new TextGenerationHttp(), this.groups),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.EVERYONE,
      new CommandEveryone(),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.RANDOM_MESSAGE,
      new CommandRandomMessage(new TextGenerationHttp()),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.STICKER,
      new CommandStickerImage(),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.HOROSCOPE,
      new CommandHoroscopePrediction(new TextGenerationHttp(), this.groups),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.CANCELF,
      new CommandCancel(new TextGenerationHttp()),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.CANCELM,
      new CommandCancel(new TextGenerationHttp()),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.PRESENTATION,
      new CommandPresentation(),
    );
    this.commandHandler.registerCommand(
      EnumSystemCommands.INVALID,
      new CommandInvalid(this.prefix),
    );
  }

  public async selectCommand(client: Client, message: Message): Promise<void> {
    if (
      BotConfiguration.isProduction() ||
      BotConfiguration.isDevelopmentChat([message.from])
    ) {
      const [command, args] = await this.getArgs(message.body);
      console.log('select command ', command, args);
      this.commandHandler.selectCommand(command, args, client, message);
    } else {
      console.log('Not is valid chat in development mode ', message.from);
    }
  }

  private async getArgs(
    message: string,
  ): Promise<[EnumValidCommands | EnumSystemCommands, string[]]> {
    const splitted = message.split(' ');

    const [commandRaw, ...rest] = splitted;
    const command = StringUtils.removeAccents(commandRaw).toLocaleLowerCase();

    if (splitted.length === 1 && (await this.isMe(command))) {
      // if args have only bot number mention
      return [EnumValidCommands.RANDOM_MESSAGE, []];
    }

    if (command.startsWith(this.prefix)) {
      if (!this.isValidCommand(command)) {
        return [EnumSystemCommands.INVALID, []];
      }

      return [command.slice(1).toLowerCase() as EnumValidCommands, rest];
    }

    return [EnumSystemCommands.DO_NOTHING, []];
  }

  private isValidCommand(
    command: string,
  ): command is EnumValidCommands | EnumSystemCommands {
    const validation = (enumItem) => this.prefix + enumItem === command;
    return (
      Object.values(EnumValidCommands).some(validation) ||
      Object.values(EnumSystemCommands).some(validation)
    );
  }

  private async getMe(): Promise<Contact | undefined> {
    const contacts = await this.client.getContacts();
    const me = contacts.find((c) => c.isMe);
    return me;
  }

  private async isMe(mention: string) {
    if (this.me === undefined || this.me === null) {
      const me = await this.getMe();
      this.me = me;
    }

    return `@${this.me?.id.user}` === mention;
  }
}

export { BotMediator };
