export enum EnumSystemCommands {
  INVALID = 'invalido',
  DO_NOTHING = 'nao_enviar_mensagem',
}

export enum EnumPrivateCommands {
  REGISTER = 'cadastro',
}

export enum EnumPublicCommands {
  EVERYONE = 'todos',
  RANDOM_MESSAGE = 'aleatorio',
  SUMMARIZE = 'resuma',
  STICKER = 'sticker',
  CANCELM = 'cancelado',
  CANCELF = 'cancelada',
  HOROSCOPE = 'horoscopo',
  PRESENTATION = 'ficha',
}

export type EnumAllCommands =
  | EnumPublicCommands
  | EnumSystemCommands
  | EnumPrivateCommands;
