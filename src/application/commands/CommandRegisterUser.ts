// spell-checker:disable
import { UseCaseRegisterUser } from 'application/use-cases/users/register-user/UseCaseRegisterUser';
import { Client, Message } from 'whatsapp-web.js';

import { ICommand } from './interfaces/ICommand';

const questions: string[] = [
  `୨୧ *Nome*(Apenas o nome): `,
  `୨୧ *Pronomes* (Quais pronomes devemos usar para você?): `,
  `୨୧ *Idade* (Quantos anos você tem?): `,
  `୨୧ *Localização em SP* (De qual parte você é?): `,
  `୨୧ *Signo* (Qual é o seu signo do zodíaco?): `,
  `୨୧ *Orientação Sexual* (Como você se identifica?): `,
  `୨୧ *Relacionamento* (Está namorando? Já superou o/a ex?): `,
  `୨୧ *Loucura por Amor* (Já fez alguma? Conte-nos!): `,
  `୨୧ *Instagram* (Qual é o seu @, se quiser compartilhar): `,
  `୨୧ *Foto* (Envie uma unidade de foto sua): `,
];

export const presentation =
  `.cadastro` +
  `\n\n•｡ꪆৎ ˚⋅ Vamos nos conhecer melhor! ౨ৎ ⋆｡˚` +
  `\n\`\`\`Responda às perguntas abaixo sem deletar as perguntas\`\`\` 🚀\n\n${questions.join(
    '\n',
  )}`;

class CommandRegisterUser implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Presentation Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    const contact = await message.getContact();
    const { name } = contact;

    const answers = await new UseCaseRegisterUser().handle(message, questions);
    messageToReply
      // .reply(answers.map((item) => item.answer).join('\n'), message.from)
      .reply(presentation + JSON.stringify(answers), message.from)
      .then((response) => response.react('👌🏼'));
  }
}

export { CommandRegisterUser };
//     .cadastro

// Vamos nos conhecer melhor!
//   •｡ꪆৎ ˚⋅Responda às perguntas abaixo sem deletar as perguntas ౨ৎ ⋆｡˚
