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

    const validCommands = Object.values(EnumValidCommands)
      .map((commands) => `*${commands.toLowerCase()}* \n`)
      .join('');

    const responseMessage = `Comando inválido! Use um dos comandos abaixo:\n${validCommands}`;
    const summarizeValidOptions = [
      `${EnumValidCommands.SUMMARIZE} 30m`,
      `${EnumValidCommands.SUMMARIZE} 1h`,
      `${EnumValidCommands.SUMMARIZE} 2h`,
      `${EnumValidCommands.SUMMARIZE} 4h`,
      `${EnumValidCommands.SUMMARIZE} 6h`,
    ].join('\n');
    const summarizeValidOptionMessage = `\nComando válido para resumo:\n${summarizeValidOptions}`;

    message.reply(`${responseMessage}${summarizeValidOptionMessage}`);
  }
}

export { CommandInvalid };
