import { EnumPublicCommands } from 'domain/enums/Commands';
import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { UseCaseListCommands } from 'application/use-cases/chats/list-commands/UseCaseListCommands';

class CommandInvalid implements IMessageCommand {
  private prefix;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Invalid - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const useCaseListCommands = new UseCaseListCommands();
    const commandsList = useCaseListCommands.execute(this.prefix);

    const responseMessage = [
      `Comando inválido! Use um dos comandos abaixo:\n`,
      commandsList,
    ];

    message
      .reply(responseMessage.join('\n'))
      .then((response) => response.react('😴'));
  }
}

export { CommandInvalid };
