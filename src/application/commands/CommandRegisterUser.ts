// spell-checker:disable
import { UseCaseRegisterUser } from 'application/use-cases/users/register-user/UseCaseRegisterUser';
import { Client, Message } from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { container } from 'tsyringe';
import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import { IGroupChat } from 'common/CustomTypes';

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

      if (registerResponse === null) {
        return;
      }

      const [chatEntity, userEntity, userDetailsEntity] = registerResponse;
      const isNew = userDetailsEntity.isNew();
      const presentation = isNew
        ? `Foi bom te conhecer \`\`\`Miaulhor\`\`\` 🐈✨ `
        : `Atualizei seus dados, agora pode engatinhar por aí 😽✨ `;
      const response = [`${presentation} @${userEntity.cellphone}`];
      const mentions = [`${userEntity.whatsappRegistry}`];

      if (isNew) {
        const notifyNewUserDetails = await this.getNotifyNewUserDetails(
          client,
          chatEntity,
        );
        response.push(notifyNewUserDetails.response);
        mentions.push(...notifyNewUserDetails.mentions);
      }

      await client
        .sendMessage(message.from, response.join('\n'), {
          mentions,
          quotedMessageId: messageToReply.id._serialized,
        })
        .then((response) => response.react('👌🏼'));
    } catch (error) {
      console.log('Error on Command Register User');
      console.log(error);
    }
  }

  private async getNotifyNewUserDetails(
    client: Client,
    chatEntity: ChatEntity,
  ): Promise<{ response: string; mentions: string[] }> {
    const whatsAppChat = (await client.getChatById(
      chatEntity.whatsappRegistry,
    )) as IGroupChat;
    const paricipants = whatsAppChat.groupMetadata.participants;
    const adminParticipants = paricipants.filter(({ isAdmin }) => isAdmin);

    const mentions: string[] = [];
    const response: string[] = [`\n*Admins:*\n`];

    adminParticipants.forEach(({ id }) => {
      mentions.push(`${id.user}@${id.server}`);
      response.push(`@${id.user}`);
    });

    return {
      mentions,
      response: response.join('\n'),
    };
  }
}

export { CommandRegisterUser };
