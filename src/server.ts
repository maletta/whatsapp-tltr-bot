/* eslint-disable no-restricted-syntax */
import { BotMediator } from 'controllers/BotMediator';
import dotenv from 'dotenv';

import { bot } from './bot';

dotenv.config();

const botMediator = new BotMediator(bot);

bot.on('media_uploaded', async (message) => {
  console.log('media_uploaded');
  console.dir(message, { depth: null }); // TODO: Implement media upload handler
  const media = await message.downloadMedia();

  message.reply(media, message.from, { sendMediaAsSticker: true });
});

bot.on('message', (message) => {
  botMediator.selectCommand(bot, message);
});
