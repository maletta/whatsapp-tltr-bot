import { Client, Message } from 'whatsapp-web.js';

import { EnumValidCommands } from '../../mediator/BotMediator';
import { ICommand } from '../ICommand';

class CommandInvalid implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Invalid - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const validCommands = Object.values(EnumValidCommands).map(
      (commands) => `*${commands.toLowerCase()}* \n`,
    );

    const responseMessage = `Comando inválido! Use um dos comandos abaixo:\n${validCommands.join('')}`;
    message.reply(responseMessage);
  }
}

export { CommandInvalid };
