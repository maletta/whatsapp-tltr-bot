/* eslint-disable no-restricted-syntax */
import { BotMediator } from 'controllers/BotMediator';
import dotenv from 'dotenv';

import { bot } from './bot';

dotenv.config();

const botMediator = new BotMediator(bot);

bot.on('message', (message) => {
  botMediator.selectCommand(bot, message);
});
