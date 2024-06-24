import { Client, GroupNotification, Message } from 'whatsapp-web.js';

interface IMessageCommand {
  execute(args: string[], client: Client, message: Message): Promise<void>;
}
1;
interface IGroupNotificationCommand {
  execute(client: Client, groupNotification: GroupNotification): Promise<void>;
}

export { IMessageCommand, IGroupNotificationCommand };
