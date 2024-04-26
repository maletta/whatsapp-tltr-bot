import { Client, Message } from 'whatsapp-web.js';

import { presentation } from './CommandRegisterUser';
import { ICommand } from './interfaces/ICommand';
import { container } from 'tsyringe';
import { UseCaseSendRegistrationForm } from 'application/use-cases/users/send-registration-form/UseCaseSendRegistrationForm';

class CommandPresentation implements ICommand {
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
      const response =
        await useCaseSendRegistrationForm.execute(messageToReply);

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
