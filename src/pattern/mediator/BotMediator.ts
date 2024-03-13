import { Client, Message } from 'whatsapp-web.js';

import { CommandHandler } from '../commands/CommandHandle';
import { CommandEveryone } from '../commands/useCases/CommandEveryOne';
import { CommandInvalid } from '../commands/useCases/CommandInvalid';
import { CommandRandomMessage } from '../commands/useCases/CommandRandomMessage';
import { CommandSummarize } from '../commands/useCases/CommandSummarize';
import { GroupManager } from './GroupManager';

export enum EnumValidCommands {
  EVERYONE = '!todos',
  RANDOM_MESSAGE = '!aleatorio',
  SUMMARIZE = '!resuma',
}

export enum EnumSystemCommands {
  INVALID = '!invalido',
}

export type EnumAllCommands = EnumValidCommands | EnumSystemCommands;

// type ValidCommandOptions = keyof typeof EnumValidCommands;

class BotMediator {
  public groups: GroupManager;
  private commandHandler: CommandHandler;

  constructor() {
    this.groups = new GroupManager();
    this.commandHandler = new CommandHandler();

    this.registerCommands();
  }

  private registerCommands(): void {
    this.commandHandler.registerCommand(
      EnumValidCommands.SUMMARIZE,
      new CommandSummarize(),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.EVERYONE,
      new CommandEveryone(),
    );
    this.commandHandler.registerCommand(
      EnumValidCommands.RANDOM_MESSAGE,
      new CommandRandomMessage(),
    );
    this.commandHandler.registerCommand(
      EnumSystemCommands.INVALID,
      new CommandInvalid(),
    );
  }

  public selectCommand(client: Client, message: Message): void {
    const [command, args] = this.getArgs(message.body);
    console.log('select command ', command, args);
    this.commandHandler.selectCommand(command, args, client, message);
  }

  private getArgs(
    message: string,
  ): [EnumValidCommands | EnumSystemCommands, string[]] {
    const args = message.split(' ');

    if (args.length === 1 || args.length === 0) {
      // args have only bot number mention
      return [EnumValidCommands.RANDOM_MESSAGE, []];
    }

    const [, command, ...rest] = args; // first args is the bot number mention

    if (command.startsWith('!') && this.isValidCommand(command)) {
      return [command.toLowerCase() as EnumValidCommands, rest];
    }

    return [EnumSystemCommands.INVALID, []];
  }

  isValidCommand(
    command: string,
  ): command is EnumValidCommands | EnumSystemCommands {
    return (
      Object.values(EnumValidCommands).includes(command as EnumValidCommands) ||
      Object.values(EnumSystemCommands).includes(command as EnumSystemCommands)
    );
  }
}

export { BotMediator };
