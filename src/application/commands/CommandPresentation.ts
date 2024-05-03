import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { container } from 'tsyringe';
import { UseCaseSendRegistrationForm } from 'application/use-cases/users/send-registration-form/UseCaseSendRegistrationForm';
import { EnumPrivateCommands } from 'domain/enums/Commands';

class CommandPresentation implements IMessageCommand {
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

    const useCaseSendRegistrationForm = container.resolve(
      UseCaseSendRegistrationForm,
    );

    try {
      const questionsFormatted =
        await useCaseSendRegistrationForm.execute(messageToReply);
      const commandRegister = `.${EnumPrivateCommands.REGISTER}`;
      const response = `${commandRegister}${questionsFormatted}`;

      messageToReply.reply(response, message.from);
    } catch (error) {
      messageToReply.reply(
        'Não estou conseguindo buscar fichas para este grupo.',
        message.from,
      );

      console.log(error);
    }
  }
}

export { CommandPresentation };
