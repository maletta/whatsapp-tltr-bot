import dotenv from 'dotenv';

import { onMessage } from './functions/onMessage';
import { QRCodeDisplay } from './QRCodeDisplay';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

console.log('v2');

const bot = WhatsAppClient.getClient();

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED', QRCodeDisplay.display(qr));
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('message', onMessage);

bot.initialize();
