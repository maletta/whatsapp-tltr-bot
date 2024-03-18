import { EnumAllCommands } from '@enums/Commands';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

type ICommands = Map<EnumAllCommands, ICommand>;
class CommandHandler {
  private commands: ICommands;

  constructor() {
    this.commands = new Map<EnumAllCommands, ICommand>();
  }

  public registerCommand(commandName: EnumAllCommands, command: ICommand) {
    this.commands.set(commandName, command);
  }

  public async selectCommand(
    commandName: EnumAllCommands,
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const command = this.commands.get(commandName);

    if (!command) {
      // throw new Error(`Command ${commandName} not found`);
      console.log(`Command ${commandName} not found`);
    }

    if (command) {
      await command.execute(args, client, message);
    }
  }
}

export { CommandHandler };
