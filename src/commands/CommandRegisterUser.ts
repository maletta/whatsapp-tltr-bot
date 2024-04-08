import { Client, Contact, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandRegisterUser implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Presentation Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const presentation2 =
      `.cadastrar` +
      `\n\n> Se apresente - *NÃO* apague as perguntas!  🥺🤤` +
      '\nSomente Nome:' +
      '\nSomente Idade:' +
      '\nDe qual parte de SP você é:' +
      '\nSigno:' +
      '\nOrientação sexual:' +
      '\nNamora? superou ex?:' +
      '\nRecomende uma série/filme ou livro:' +
      '\nPronomes:' +
      '\nJá fez alguma loucura por amor: ' +
      '\nApenas seu Insta:' +
      '\nUnidade de foto sua:';

    const presentation =
      `.cadastrar` +
      `\n\n🌟 Vamos nos conhecer melhor!🌟` +
      `\n\`\`\`Responda às perguntas abaixo sem deletar as perguntas\`\`\` 🚀\n\n` +
      `\n\n✍🏼 *Nome*: (Apenas o nome)` +
      `\n🔠 *Pronomes*: (Quais pronomes devemos usar para você?)` +
      `\n🎂 *Idade*: (Quantos anos você tem?)` +
      `\n🏙️ *Localização em SP*: (De qual parte você é?)` +
      `\n♈ *Signo*: (Qual é o seu signo do zodíaco?)` +
      `\n💞 *Orientação Sexual*: (Como você se identifica?)` +
      `\n💔 *Relacionamento*: (Está namorando? Já superou o/a ex?)` +
      `\n🎬 *Recomendação*: (Uma série, filme ou livro que você ama)` +
      `\n💖 *Loucura por Amor*: (Já fez alguma? Conte-nos!)` +
      `\n📸 *Instagram*: (Qual é o seu @, se quiser compartilhar)` +
      `\n🤳 *Foto*: (Envie uma unidade de foto sua)`;

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    console.dir(message, { depth: null });

    const info = await message.getInfo();

    console.log('----- get info ------');

    console.dir(info, { depth: null });

    const contact = await message.getContact();

    const { name } = contact;

    console.log('----- get Contact ------');

    console.dir(contact, { depth: null });

    messageToReply.reply(presentation2, message.from);
    messageToReply.reply(presentation, message.from);
  }
}

export { CommandRegisterUser };
