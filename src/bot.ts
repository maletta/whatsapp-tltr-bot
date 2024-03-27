import { WhatsAppClient } from 'controllers/WhatsAppClient';
import { QRCodeDisplay } from 'utils/QRCodeDisplay';

export const bot = WhatsAppClient.getClient();

console.log('initialize bot');

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED');
  QRCodeDisplay.display(qr);
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('media_uploaded', async (message) => {
  console.log('media_uploaded');
  console.dir(message, { depth: null }); // TODO: Implement media upload handler
  const media = await message.downloadMedia();

  message.reply(media, message.from, { sendMediaAsSticker: true });
});

bot.initialize();
