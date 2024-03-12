import { Client, Message } from 'whatsapp-web.js';

import { CommandHandler } from '../commands/CommandHandle';
import { CommandEveryone } from '../commands/useCases/CommandEveryOne';
import { CommandSummarize } from '../commands/useCases/CommandSummarize';
import { GroupManager } from './GroupManager';

class BotMediator {
  public groups: GroupManager;
  private commandHandler: CommandHandler;

  constructor() {
    this.groups = new GroupManager();
    this.commandHandler = new CommandHandler();

    this.registerCommands();
  }

  private registerCommands(): void {
    this.commandHandler.registerCommand('!resuma', new CommandSummarize());
    this.commandHandler.registerCommand('!todos', new CommandEveryone());
  }

  public selectCommand(
    commandName: string,
    client: Client,
    message: Message,
  ): void {
    const [command, args] = this.getArgs(commandName);
    this.commandHandler.selectCommand(command, args, client, message);
  }

  private getArgs(command: string): [string, string[]] {
    const args = command.includes(' ') ? command.split(' ') : [command];

    return [args[0].toLowerCase(), args.slice(1)];
  }
}

export { BotMediator };
