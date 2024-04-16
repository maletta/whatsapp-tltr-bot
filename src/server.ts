/* eslint-disable no-restricted-syntax */
import { BotMediator } from 'application/controllers/BotMediator';
import dotenv from 'dotenv';
import { QRCodeDisplay } from 'infrastructure/qr-code/QRCodeDisplay';
import { WhatsAppClient } from 'infrastructure/whatsapp/WhatsAppClient';

dotenv.config();

console.log('initialize bot');

const bot = WhatsAppClient.getClient();
const botMediator = new BotMediator(bot);

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED');
  QRCodeDisplay.display(qr);
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('message', (message) => {
  botMediator.selectCommand(bot, message);
});

bot.initialize();
