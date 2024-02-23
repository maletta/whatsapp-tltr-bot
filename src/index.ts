/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import { Client, LocalAuth } from 'whatsapp-web.js';

import { getChats } from './functions/getChats';
import { onMessage } from './functions/onMessage';
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

  // const chat = await getChats(client, process.env.CHAT_NAME);
  // console.dir(chat, { depth: null });
});

client.on('message', onMessage);

client.initialize();
