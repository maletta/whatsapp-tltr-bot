export enum EnumValidCommands {
  EVERYONE = 'todos',
  RANDOM_MESSAGE = 'aleatorio',
  SUMMARIZE = 'resuma',
  STICKER = 'sticker',
}

export enum EnumSystemCommands {
  INVALID = 'invalido',
  DO_NOTHING = 'nao_enviar_mensagem',
}

export type EnumAllCommands = EnumValidCommands | EnumSystemCommands;