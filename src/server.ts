import dotenv from 'dotenv';

import { onMessage } from './functions/onMessage';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

const bot = WhatsAppClient.getClient();

bot.on('ready', () => console.log('client is ready!'));
bot.on('authenticated', () => console.log('authenticated!'));
bot.on('message', onMessage);

bot.initialize();
