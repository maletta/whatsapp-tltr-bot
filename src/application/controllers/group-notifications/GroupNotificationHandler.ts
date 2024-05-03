import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';

import {
  Client,
  GroupNotification,
  GroupNotificationTypes,
} from 'whatsapp-web.js';
import { GroupNotificationsExecutor } from './GroupNotificationExecutor';
import { CommandJoinUserInChat } from 'application/commands/CommandJoinUserInChat';
import { IBotMediatorDTO } from '../BotMediator';

class GroupNotificationHandler {
  private groups: GroupsManager;
  private commandExecutor: GroupNotificationsExecutor;
  private prefix: string;
  private client: Client;

  constructor(client: Client, groups: GroupsManager, args: IBotMediatorDTO) {
    this.client = client;
    this.prefix = args.prefix;
    this.commandExecutor = new GroupNotificationsExecutor();
    this.groups = groups;

    this.registerCommands(this.groups);
  }

  private registerCommands(groups: GroupsManager): void {
    this.commandExecutor.registerCommand(
      GroupNotificationTypes.ADD,
      new CommandJoinUserInChat(this.prefix, groups),
    );

    this.commandExecutor.registerCommand(
      GroupNotificationTypes.INVITE,
      new CommandJoinUserInChat(this.prefix, groups),
    );
  }

  public async selectCommand(
    groupNotification: GroupNotification,
  ): Promise<void> {
    this.commandExecutor.selectCommand(this.client, groupNotification);
  }
}

export { GroupNotificationHandler };
