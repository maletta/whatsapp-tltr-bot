import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandPresentation implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Presentation Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const presentation =
      `SE APRESENTEM! 🥺🤤` +
      '\nNome:' +
      '\nIdade:' +
      '\nDe qual parte de SP você é:' +
      '\nSigno:' +
      '\nOrientação sexual:' +
      '\nnamora? superou ex?:' +
      '\nRecomende uma série/filme ou livro:' +
      '\nPronomes:' +
      '\nJá fez alguma loucura por amor: ' +
      '\nInsta:' +
      '\nUma unidade de foto:' +
      '\n\nMarque os adms: Donnie maple e Paule (obrigatório)';

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    messageToReply.reply(presentation, message.from);
  }
}

export { CommandPresentation };
