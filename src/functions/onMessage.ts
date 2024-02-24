import { Message } from 'whatsapp-web.js';

import { isMessageToBot } from './shared';

async function onMessage(message: Message) {
  const isValidMessage = await isMessageToBot(message);

  if (!isValidMessage) {
    return;
  }
  const chat = await message.getChat();
  const contact = await message.getContact();

  await chat.sendMessage(`Respota @${contact.id.user}`, {
    mentions: [contact],
  });

  console.log('isValidMessage');
  console.log(isValidMessage);
}

export { onMessage };
