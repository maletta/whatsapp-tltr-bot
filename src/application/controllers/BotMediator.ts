import { GroupsManager } from 'domain/entities/group-manager/GroupsManager';
import { Client, GroupNotification, Message } from 'whatsapp-web.js';
import { MessagesHandler } from './messages/MessagesHandler';
import { GroupNotificationHandler } from './group-notifications/GroupNotificationHandler';

// type ValidCommandOptions = keyof typeof EnumValidCommands;

type IBotMediatorDTO = {
  prefix: string;
};
class BotMediator {
  public groups: GroupsManager;
  private client: Client;
  private messagesHandler: MessagesHandler;
  private groupNotificationsHandler: GroupNotificationHandler;
  private args: IBotMediatorDTO;

  constructor(client: Client, args: Partial<IBotMediatorDTO> = {}) {
    this.args = {
      prefix: args.prefix || '.',
    };
    this.groups = new GroupsManager();
    this.client = client;
    this.messagesHandler = new MessagesHandler(
      this.client,
      this.groups,
      this.args,
    );
    this.groupNotificationsHandler = new GroupNotificationHandler(
      this.client,
      this.groups,
      this.args,
    );
  }

  public async selectMessageCommand(message: Message): Promise<void> {
    this.messagesHandler.selectCommand(message);
  }

  public async selectGroupNotificationCommand(
    groupNotification: GroupNotification,
  ): Promise<void> {
    this.groupNotificationsHandler.selectCommand(groupNotification);
  }
}

export { BotMediator };
export type { IBotMediatorDTO };
