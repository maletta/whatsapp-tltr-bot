import { Message } from 'whatsapp-web.js';

async function isMessageToBot(message: Message): Promise<boolean> {
  const mentions = await message.getMentions();

  return (
    mentions.length === 1 &&
    mentions.some((mention) => mention.isMe && mention.isMyContact)
  );
}

export { isMessageToBot };
