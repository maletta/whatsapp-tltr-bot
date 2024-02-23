/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import { Client, LocalAuth } from 'whatsapp-web.js';

import { IChat } from './@types/augmentation';
import { QRCodeDisplay } from './QRCodeDisplay';

dotenv.config();

const client = new Client({
  // puppeteer: { headless: true },
  authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED', QRCodeDisplay.display(qr));
});

client.on('authenticated', () => {
  console.log('Authentication successful! ');
  console.log();
});

client.on('remote_session_saved', (session) => {
  console.log('remote_session_saved ', session);
});

client.on('ready', async () => {
  console.log('Client is ready!');
  const isGroup = Boolean(process.env.IS_GROUP);
  const chatName = process.env.CHAT_NAME;
  const chatCreateTimestamp = Number(process.env.CHAT_CREATION_TIMESTAMP);

  const chat = await client.getChats().then((chats) => {
    const filteredChats = chats.filter((c) => {
      const chatAugmented = c as unknown as IChat;
      if (chatAugmented.name === chatName) {
        if (
          chatAugmented.isGroup &&
          chatAugmented.groupMetadata
          // chatAugmented.groupMetadata.creation === chatCreateTimestamp
        ) {
          return true;
        }
      }

      return false;
    });

    return filteredChats;
  });

  // console.log(chat);
  console.dir(chat, { depth: null });
});

client.initialize();
