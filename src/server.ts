/* eslint-disable no-restricted-syntax */
import { BotMediator } from '@controllers/BotMediator';
import { bot } from 'bot';
import dotenv from 'dotenv';

dotenv.config();

const botMediator = new BotMediator(bot);

bot.on('message', (message) => {
  botMediator.selectCommand(bot, message);
});
