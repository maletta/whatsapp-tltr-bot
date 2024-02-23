import { WhatsAppClient } from 'src/WhatsAppClient';
import { Message } from 'whatsapp-web.js';

import { isMessageToBot } from './shared';

async function onMessage(message: Message) {
  const isValidMessage = await isMessageToBot(message);
  console.log('isValidMessage');
  console.log(isValidMessage);
}

export { onMessage };
