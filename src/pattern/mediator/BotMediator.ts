import { Client, Message } from 'whatsapp-web.js';

import { CommandHandler } from '../commands/CommandHandle';
import { CommandEveryone } from '../commands/useCases/CommandEveryOne';
import { CommandInvalid } from '../commands/useCases/CommandInvalid';
import { CommandRandomMessage } from '../commands/useCases/CommandRandomMessage';
import { CommandSummarize } from '../commands/useCases/CommandSummarize';
import { GroupManager } from './GroupManager';

export enum EnumValidCommands {
  EVERYONE = 'todos',
  RANDOM_MESSAGE = 'aleatorio',
  SUMMARIZE = 'resuma',
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

  constructor(args: Partial<IBotMediatorDTO> = {}) {
    this.prefix = args.prefix || '.';
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
      new CommandInvalid(this.prefix),
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
}

export { BotMediator };
