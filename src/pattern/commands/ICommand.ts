import { Client, Message } from 'whatsapp-web.js';

interface ICommand {
  execute(client: Client, message: Message): Promise<void>;
}

export { ICommand };
