/* eslint-disable no-restricted-syntax */
import dotenv from 'dotenv';

import { BotMediator } from './pattern/mediator/BotMediator';
import { QRCodeDisplay } from './QRCodeDisplay';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

// askChatGPT('olá eu gosto de azul');

console.log('v2');

// makeRequest();
// createNonStreamingMultipartContent('mensagem para resumir');

const bot = WhatsAppClient.getClient();
const botMediator = new BotMediator();

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED', QRCodeDisplay.display(qr));
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('message', (message) => {
  botMediator.selectCommand(bot, message);
});

bot.initialize();

// sudo ssh -i ~/.ssh/my-aws/CHAVE-WHATSAPP-BOT.pem ec2-user@ip-public
