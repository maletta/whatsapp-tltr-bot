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

    const presentation2 =
      `.cadastro` +
      `\n\n🌟 Vamos nos conhecer melhor!🌟` +
      `\n\`\`\`Responda às perguntas abaixo sem deletar as perguntas\`\`\` 🚀\n\n` +
      questions.join('\n');

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    messageToReply.reply(presentation2, message.from);
  }
}

export { CommandPresentation };
