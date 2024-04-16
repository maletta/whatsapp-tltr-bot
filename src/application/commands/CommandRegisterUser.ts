import { Client, Contact, Message } from 'whatsapp-web.js';

import { ICommand } from './ICommand';
import { UseCaseRegisterUser } from 'application/use-cases/users/register-user/UseCaseRegisterUser';

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
      `.cadastro` +
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

    const questions: string[] = [
      `✍🏼 *Nome*(Apenas o nome): `,
      `🔠 *Pronomes* (Quais pronomes devemos usar para você?): `,
      `🎂 *Idade* (Quantos anos você tem?): `,
      `🏙️ *Localização em SP* (De qual parte você é?): `,
      `♈ *Signo* (Qual é o seu signo do zodíaco?): `,
      `💞 *Orientação Sexual* (Como você se identifica?): `,
      `💔 *Relacionamento* (Está namorando? Já superou o/a ex?): `,
      `🎬 *Recomendação* (Uma série, filme ou livro que você ama): `,
      `💖 *Loucura por Amor* (Já fez alguma? Conte-nos!): `,
      `📸 *Instagram* (Qual é o seu @, se quiser compartilhar): `,
      `🤳 *Foto* (Envie uma unidade de foto sua): `,
    ];

    //     .cadastro

    // Vamos nos conhecer melhor!
    //   •｡ꪆৎ ˚⋅Responda às perguntas abaixo sem deletar as perguntas ౨ৎ ⋆｡˚

    // ୨୧ Nome:
    // ୨୧ Pronomes (Quais pronomes devemos usar para você?):
    // ୨୧ Idade:
    // ୨୧ Localização:
    // ୨୧: Orientação sexual (Como você se identifica?):
    // ୨୧ Relacionamento (Está namorando? Já superou o/a ex?):
    // ୨୧ *

    const presentation =
      `.cadastro` +
      `\n\n🌟 Vamos nos conhecer melhor!🌟` +
      `\n\`\`\`Responda às perguntas abaixo sem deletar as perguntas\`\`\` 🚀\n\n${questions.join(
        '\n',
      )}`;

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    const contact = await message.getContact();
    const { name } = contact;

    const answers = await new UseCaseRegisterUser().handle(message, questions);
    messageToReply
      // .reply(answers.map((item) => item.answer).join('\n'), message.from)
      .reply(JSON.stringify(answers), message.from)
      .then((response) => response.react('👌🏼'));

    // messageToReply.reply(presentation2, message.from);
    // messageToReply.reply(presentation, message.from);
  }
}

export { CommandRegisterUser };
