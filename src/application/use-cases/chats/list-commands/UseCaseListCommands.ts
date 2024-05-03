import { EnumPublicCommands } from 'domain/enums/Commands';

class UseCaseListCommands {
  public execute(prefix: string): string {
    const validCommands = Object.values(EnumPublicCommands)
      .map((commands) => `*${prefix}${commands.toLowerCase()}* \n`)
      .join('');

    const validCommandsOptions = `\nComandos disponíveis:\n`;
    const summarizeValidOptions = [
      `\nComando válido para resumo:\n`,
      `${prefix}${EnumPublicCommands.SUMMARIZE} 30m`,
      `${prefix}${EnumPublicCommands.SUMMARIZE} 1h`,
      `${prefix}${EnumPublicCommands.SUMMARIZE} 2h`,
      `${prefix}${EnumPublicCommands.SUMMARIZE} 4h`,
      `${prefix}${EnumPublicCommands.SUMMARIZE} 6h`,
    ].join('\n');

    const response = `${validCommandsOptions}${validCommands}${summarizeValidOptions}`;

    return response;
  }
}

export { UseCaseListCommands };
