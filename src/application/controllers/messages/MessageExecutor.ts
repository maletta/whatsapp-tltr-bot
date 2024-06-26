import { EnumAllCommands } from 'domain/enums/Commands';
import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from '../../commands/interfaces/ICommand';
import { BotConfiguration } from 'config/Configuration';

type IIMessageCommands = Map<EnumAllCommands, IMessageCommand>;
class MessageExecutor {
  private commands: IIMessageCommands;

  constructor() {
    this.commands = new Map<EnumAllCommands, IMessageCommand>();
  }

  public registerCommand(
    commandName: EnumAllCommands,
    command: IMessageCommand,
  ) {
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
      if (BotConfiguration.isDevelopment()) {
        console.log(`Command ${commandName} not found`);
      }
    }

    if (command) {
      command.execute(args, client, message);
    }
  }
}

export { MessageExecutor };
