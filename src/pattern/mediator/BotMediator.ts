import { Client, Message } from 'whatsapp-web.js';

import { CommandHandler } from '../commands/CommandHandle';
import { CommandEveryone } from '../commands/useCases/CommandEveryOne';
import { CommandSummarize } from '../commands/useCases/CommandSummarize';
import { GroupManager } from './GroupManager';

class BotMediator {
  public groups: GroupManager;
  private commandHandle: CommandHandler;

  constructor() {
    this.groups = new GroupManager();
    this.commandHandle = new CommandHandler();

    this.registerCommands();
  }

  private registerCommands(): void {
    this.commandHandle.registerCommand('!resuma', new CommandSummarize());
    this.commandHandle.registerCommand('!todos', new CommandEveryone());
  }

  public selectCommand(
    commandName: string,
    client: Client,
    message: Message,
  ): void {
    this.selectCommand(commandName, client, message);
  }
}

export { BotMediator };
