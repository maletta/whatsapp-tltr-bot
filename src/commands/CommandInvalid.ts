import { EnumValidCommands } from '@enums/Commands';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandInvalid implements ICommand {
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

    const validCommands = Object.values(EnumValidCommands)
      .map((commands) => `*${this.prefix}${commands.toLowerCase()}* \n`)
      .join('');

    const responseMessage = `Comando inválido! Use um dos comandos abaixo:\n${validCommands}`;
    const summarizeValidOptions = [
      `${this.prefix}${EnumValidCommands.SUMMARIZE} 30m`,
      `${this.prefix}${EnumValidCommands.SUMMARIZE} 1h`,
      `${this.prefix}${EnumValidCommands.SUMMARIZE} 2h`,
      `${this.prefix}${EnumValidCommands.SUMMARIZE} 4h`,
      `${this.prefix}${EnumValidCommands.SUMMARIZE} 6h`,
    ].join('\n');
    const summarizeValidOptionMessage = `\nComando válido para resumo:\n${summarizeValidOptions}`;

    message.reply(`${responseMessage}${summarizeValidOptionMessage}`);
  }
}

export { CommandInvalid };
