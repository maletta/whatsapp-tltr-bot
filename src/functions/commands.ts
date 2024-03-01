import { IChat } from 'src/@types/augmentation';
import { Message, Contact, Client } from 'whatsapp-web.js';

export async function commandEveryOne(
  client: Client,
  message: Message,
): Promise<void> {
  const chat = (await message.getChat()) as unknown as IChat;
  const mentions: string[] = [];
  const responseText: string[] = [];

  if (chat.isGroup === true) {
    const paricipants = chat.groupMetadata.participants;

    paricipants.forEach((p) => {
      mentions.push(`${p.id.user}@c.us`);
      responseText.push(`@${p.id.user}`);
    });
  }
  const text = responseText.join('');

  console.log('mentions', mentions);
  console.log('responseText', text);
  await client.sendMessage(message.from, 'Hello', {
    mentions: mentions as unknown as Contact[],
  });
}
