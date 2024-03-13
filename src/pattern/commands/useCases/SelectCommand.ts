import { Client, Contact, Message } from 'whatsapp-web.js';

import { ICommand } from '../ICommand';

class SelectCommands implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Select Command - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const contacts = await message.getMentions();
    const content = await this.removeMentionFromBody(message.body, contacts); //  body: '@5511964869895 !resumo',

    console.log('---content------', content);

    switch (content) {
      case '!resumo':
        console.log('resumir');
        // commandSummarizeMessages(client, message);
        break;

      case '!todos':
        console.log('marcar todos');
        // commandEveryOne(client, message);
        break;

      case '!f':
      case '!figurinha':
      case '!s':
      case '!sticker':
        console.log('fazer figurinha');
        break;
      case '!embed':
        // createEmbed(client, message);
        break;
      default:
        console.log('nenhumn comando relacionado');
        break;
    }
  }

  private async removeMentionFromBody(
    body: string,
    contact: Contact[],
  ): Promise<string> {
    const mentions: string[] = contact.map((c) => c.id.user);
    const regex = new RegExp(
      mentions.map((mention) => `@${mention}`).join('|'),
      'gi',
    );

    return body.replace(regex, '').trim();
  }
}

export { SelectCommands };
