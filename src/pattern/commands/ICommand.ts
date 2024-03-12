import { Client, Message } from 'whatsapp-web.js';

interface ICommand {
  execute(args: string[], client: Client, message: Message): Promise<void>;
}

export { ICommand };
