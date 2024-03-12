import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

type ICommands = Map<string, ICommand>;
class CommandHandler {
  private commands: ICommands;

  constructor() {
    this.commands = new Map<string, ICommand>();
  }

  public registerCommand(commandName: string, command: ICommand) {
    this.commands.set(commandName, command);
  }

  async selectCommand(
    commandName: string,
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const command = this.commands.get(commandName);

    if (!command) {
      throw new Error(`Command ${commandName} not found`);
    }

    await command.execute(args, client, message);
  }
}

export { CommandHandler };
