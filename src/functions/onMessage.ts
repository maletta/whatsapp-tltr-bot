import WwebjsSender from '@deathabyss/wwebjs-sender';
import { Chat, Client, Message, MessageTypes } from 'whatsapp-web.js';

import { askChatGPT, sendPromptToOpenAI } from './askGpt';
import { concatMessages, isMessageToBot, isTimestampBetween } from './shared';

async function onMessage(client: Client, message: Message) {
  const isValidMessage = await isMessageToBot(message);
  if (!isValidMessage) {
    return;
  }
  const chat = await message.getChat();
  const contact = await message.getContact();

  const allMessages: Message[] = await chat
    .fetchMessages({
      limit: 1000,
    })
    .then((foundMessages) => {
      return foundMessages.filter(
        (msg) =>
          msg.type === MessageTypes.TEXT &&
          isTimestampBetween.fourHours(msg.timestamp),
      );
    });

  const concat = concatMessages(allMessages);

  try {
    // const gptresponse = await chatGPT.sendMessage('quanto é 1 + 1');

    await chat.sendMessage(`Respota @${contact.id.user} `, {
      mentions: [contact],
    });
  } catch (error) {
    console.log(error);
  }
  // console.log(allMessages.map((msg) => msg.body));
  // console.dir(chat, { depth: 2 });
}

export { onMessage };
