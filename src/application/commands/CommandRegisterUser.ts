// spell-checker:disable
import { UseCaseRegisterUser } from 'application/use-cases/users/register-user/UseCaseRegisterUser';
import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { container } from 'tsyringe';

class CommandRegisterUser implements IMessageCommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Presentation Message - execute');
    console.log('args ', args);
    console.log('message ', message.body);

    const messageToReply = message.hasQuotedMsg
      ? await message.getQuotedMessage()
      : message;

    try {
      const useCaseRegisterUse = container.resolve(UseCaseRegisterUser);
      const registerResponse = await useCaseRegisterUse.execute(message);

      if (registerResponse !== null) {
        const [user, userEntity] = registerResponse;
        const isNew = userEntity.isNew();
        const response = `Foi bom te conhecer miawlhor 🐈✨ @${user.cellphone}`;
        const mentions = [`${user.whatsappRegistry}`];
        await client
          .sendMessage(message.from, response, {
            mentions,
            quotedMessageId: messageToReply.id._serialized,
          })
          .then((response) => response.react('👌🏼'));
      }
    } catch (error) {
      console.log('Error on Command Register User');
      console.log(error);
    }
  }
}

export { CommandRegisterUser };
