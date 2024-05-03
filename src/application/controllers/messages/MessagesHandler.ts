import { CommandCancel } from 'application/commands/CommandCancel';
import { CommandEveryone } from 'application/commands/CommandEveryOne';
import { CommandHoroscopePrediction } from 'application/commands/CommandHoroscopePrediction';
import { CommandInvalid } from 'application/commands/CommandInvalid';
import { CommandPresentation } from 'application/commands/CommandPresentation';
import { CommandRandomMessage } from 'application/commands/CommandRandomMessage';
import { CommandRegisterUser } from 'application/commands/CommandRegisterUser';
import { CommandStickerImage } from 'application/commands/CommandStickerImage';
import { CommandSummarize } from 'application/commands/CommandSummarize';
import { TextGenerationHttp } from 'application/services/text-generation/implementation/TextGenerationHttp';
import { BotConfiguration } from 'config/Configuration';
import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';
import {
  EnumAllCommands,
  EnumPrivateCommands,
  EnumPublicCommands,
  EnumSystemCommands,
} from 'domain/enums/Commands';
import { StringUtils } from 'utils/String.utils';
import { Client, Contact, Message } from 'whatsapp-web.js';
import { IBotMediatorDTO } from '../BotMediator';
import { MessageExecutor } from './MessageExecutor';
import { CommandAdvice } from 'application/commands/CommandAdvice';

class MessagesHandler {
  private groups: GroupsManager;
  private commandExecutor: MessageExecutor;
  private prefix: string;
  private client: Client;
  private me: Contact | undefined | null;

  constructor(client: Client, groups: GroupsManager, args: IBotMediatorDTO) {
    this.client = client;
    this.prefix = args.prefix;
    this.commandExecutor = new MessageExecutor();
    this.groups = groups;

    this.registerCommands(this.groups);
  }

  private registerCommands(groups: GroupsManager): void {
    this.commandExecutor.registerCommand(
      EnumPublicCommands.SUMMARIZE,
      new CommandSummarize(new TextGenerationHttp(), groups),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.EVERYONE,
      new CommandEveryone(),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.RANDOM_MESSAGE,
      new CommandRandomMessage(new TextGenerationHttp()),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.STICKER,
      new CommandStickerImage(),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.HOROSCOPE,
      new CommandHoroscopePrediction(new TextGenerationHttp(), groups),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.CANCELF,
      new CommandCancel(new TextGenerationHttp()),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.CANCELM,
      new CommandCancel(new TextGenerationHttp()),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.ADVICE,
      new CommandAdvice(new TextGenerationHttp()),
    );
    this.commandExecutor.registerCommand(
      EnumPublicCommands.PRESENTATION,
      new CommandPresentation(),
    );

    this.commandExecutor.registerCommand(
      EnumPrivateCommands.REGISTER,
      new CommandRegisterUser(),
    );

    this.commandExecutor.registerCommand(
      EnumSystemCommands.INVALID,
      new CommandInvalid(this.prefix),
    );
  }

  public async selectCommand(message: Message): Promise<void> {
    if (
      BotConfiguration.isProduction() ||
      BotConfiguration.isDevelopmentChat([message.from])
    ) {
      const [command, args] = await this.getArgs(message.body);
      console.log('select command ', command, args);
      this.commandExecutor.selectCommand(command, args, this.client, message);
    } else {
      console.log('Not is valid chat in development mode', message.from);
    }
  }

  private async getArgs(message: string): Promise<[EnumAllCommands, string[]]> {
    const splitted = message.trim().split(/\s+/);

    const [commandRaw, ...rest] = splitted;

    if (commandRaw === null || commandRaw === undefined) {
      return [EnumSystemCommands.DO_NOTHING, []];
    }

    const command = StringUtils.removeAccents(commandRaw)?.toLocaleLowerCase();

    if (command === null || command === undefined) {
      return [EnumSystemCommands.DO_NOTHING, []];
    }

    const me = await this.isMe(command);

    if (splitted.length === 1 && me) {
      // if args have only bot number mention
      return [EnumPublicCommands.RANDOM_MESSAGE, []];
    }

    // if have prefix but have by pass content
    if (this.willByPassCommand(command)) {
      return [EnumSystemCommands.DO_NOTHING, []];
    }

    // if have prefix but is invalid
    if (command.startsWith(this.prefix) && !this.isValidCommand(command)) {
      console.log(
        'invalid',
        command.startsWith(this.prefix),
        !this.isValidCommand(command),
      );
      console.log('commando', command, command.length);
      console.log('rest', rest);
      return [EnumSystemCommands.INVALID, []];
    }

    // if have a valid prefix
    return [command.slice(1).toLowerCase() as EnumAllCommands, rest];
  }

  private willByPassCommand(command: string) {
    const haveMultiplePrefix = command.startsWith(
      `${this.prefix}${this.prefix}`,
    );
    const IsCommandOnlyPrefix = command === this.prefix;

    if (haveMultiplePrefix || IsCommandOnlyPrefix) {
      return true;
    }

    return false;
  }

  private isValidCommand(
    command: string,
  ): command is EnumPublicCommands | EnumSystemCommands | EnumPrivateCommands {
    const validation = (enumItem: string) => this.prefix + enumItem === command;

    return (
      Object.values(EnumPublicCommands).some(validation) ||
      Object.values(EnumSystemCommands).some(validation) ||
      Object.values(EnumPrivateCommands).some(validation)
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

export { MessagesHandler };
