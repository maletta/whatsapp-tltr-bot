import dotenv from 'dotenv';

import { askChatGPT } from './functions/askGpt';
import { onMessage } from './functions/onMessage';
import { QRCodeDisplay } from './QRCodeDisplay';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

// askChatGPT('olá eu gosto de azul');

console.log('v2');

// const bot = WhatsAppClient.getClient();

// bot.on('ready', () => console.log('client is ready!'));

// bot.on('qr', (qr) => {
//   console.log('QR RECEIVED', QRCodeDisplay.display(qr));
// });

// bot.on('authenticated', () => console.log('authenticated!'));

// bot.on('message', (message) => onMessage(bot, message));

// bot.initialize();

// sudo ssh -i ~/.ssh/my-aws/CHAVE-WHATSAPP-BOT.pem ec2-user@ip-public
