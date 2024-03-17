/* eslint-disable no-restricted-syntax */
import { BotMediator } from '@controller/BotMediator';
import { WhatsAppClient } from '@controller/WhatsAppClient';
import { QRCodeDisplay } from '@utils/QRCodeDisplay';
import dotenv from 'dotenv';

dotenv.config();

console.log('initalize bot');

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

// sudo ssh -i ~/.ssh/my-aws/CHAVE-WHATSAPP-BOT.pem ec2-user@ip-public
