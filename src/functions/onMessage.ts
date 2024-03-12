import { Client, Contact, Message } from 'whatsapp-web.js';

import { isMessageToBot } from './shared';

async function removeMentionFromBody(
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

async function selectCommand(client: Client, message: Message) {
  const contacts = await message.getMentions();
  const content = await removeMentionFromBody(message.body, contacts); //  body: '@5511964869895 !resumo',

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

async function onMessage(client: Client, message: Message) {
  const isValidMessage = await isMessageToBot(message);

  if (!isValidMessage) {
    return;
  }

  await selectCommand(client, message);

  // console.log(allMessages.map((msg) => msg.body));
  // console.dir(message, { depth: 2 });
}

export { onMessage };
