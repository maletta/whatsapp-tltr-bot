import {
  Client,
  GroupNotification,
  GroupNotificationTypes,
} from 'whatsapp-web.js';

import { IGroupNotificationCommand } from '../../commands/interfaces/ICommand';

type IGroupNotificationCommands = Map<
  GroupNotificationTypes,
  IGroupNotificationCommand
>;
class GroupNotificationsExecutor {
  private commands: IGroupNotificationCommands;

  constructor() {
    this.commands = new Map<
      GroupNotificationTypes,
      IGroupNotificationCommand
    >();
  }

  public registerCommand(
    commandName: GroupNotificationTypes,
    command: IGroupNotificationCommand,
  ) {
    this.commands.set(commandName, command);
  }

  public async selectCommand(
    client: Client,
    groupNotification: GroupNotification,
  ): Promise<void> {
    const commandType = groupNotification.type;
    const command = this.commands.get(commandType);

    if (!command) {
      // throw new Error(`Command ${commandName} not found`);
      console.log(`Command ${commandType} not found`);
    }

    if (command) {
      await command.execute(client, groupNotification);
    }
  }
}

export { GroupNotificationsExecutor };
