/* eslint-disable no-restricted-syntax */
import { BotMediator } from 'controllers/BotMediator';
import { WhatsAppClient } from 'controllers/WhatsAppClient';
import dotenv from 'dotenv';
import { QRCodeDisplay } from 'utils/QRCodeDisplay';

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

bot.on('media_uploaded', async (message) => {
  console.log('media_uploaded');
  console.dir(message, { depth: null }); // TODO: Implement media upload handler
  const media = await message.downloadMedia();

  message.reply(media, message.from, { sendMediaAsSticker: true });
});

bot.initialize();
