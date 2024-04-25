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

    await useCaseSendRegistrationForm.execute(messageToReply);

    messageToReply.reply(presentation, message.from);
  }
}

export { CommandPresentation };
