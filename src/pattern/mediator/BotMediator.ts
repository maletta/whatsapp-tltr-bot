import { Client, Contact, Message } from 'whatsapp-web.js';

import { CommandHandler } from '../commands/CommandHandle';
import { CommandEveryone } from '../commands/useCases/CommandEveryOne';
import { CommandInvalid } from '../commands/useCases/CommandInvalid';
import { CommandRandomMessage } from '../commands/useCases/CommandRandomMessage';
import { CommandStickerImage } from '../commands/useCases/CommandStickerImage';
import { CommandSummarize } from '../commands/useCases/CommandSummarize';
import { TextSummarizeHttp } from '../services/implementation/TextSummarizeHttp';
import { GroupManager } from './GroupManager';

export enum EnumValidCommands {
  EVERYONE = 'todos',
  RANDOM_MESSAGE = 'aleatorio',
  SUMMARIZE = 'resuma',
  STICKER = 'sticker',
}

export enum EnumSystemCommands {
  INVALID = 'invalido',
  DO_NOTHING = 'nao_enviar_mensagem',
}

export type EnumAllCommands = EnumValidCommands | EnumSystemCommands;

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
      new CommandSummarize(new TextSummarizeHttp()),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.EVERYONE,
      new CommandEveryone(),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.RANDOM_MESSAGE,
      new CommandRandomMessage(new TextSummarizeHttp()),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.STICKER,
      new CommandStickerImage(),
    );
    this.commandHandler.registerCommand(
      EnumSystemCommands.INVALID,
      new CommandInvalid(this.prefix),
    );
  }

  public async selectCommand(client: Client, message: Message): Promise<void> {
    const [command, args] = await this.getArgs(message.body);
    console.log('select command ', command, args);
    this.commandHandler.selectCommand(command, args, client, message);
  }

  private async getArgs(
    message: string,
  ): Promise<[EnumValidCommands | EnumSystemCommands, string[]]> {
    const args = message.split(' ');

    const [command, ...rest] = args;

    if (args.length === 1 && (await this.isMe(command))) {
      // args have only bot number mention
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
    console.log('Me ', mention, this.me);

    return `@${this.me?.id.user}` === mention;
  }
}

export { BotMediator };
