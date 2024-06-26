/* eslint-disable no-restricted-syntax */
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { BotMediator } from 'application/controllers/BotMediator';
import { QRCodeDisplay } from 'infrastructure/qr-code/QRCodeDisplay';
import { WhatsAppClient } from 'infrastructure/whatsapp/WhatsAppClient';

import { connectDatabase } from 'common/container';
import { GroupNotification, GroupNotificationTypes } from 'whatsapp-web.js';

console.log('initialize bot');

(async () => {
  try {
    connectDatabase();

    const bot = WhatsAppClient.getClient();
    const botMediator = new BotMediator(bot);

    bot.on('ready', () => console.log('client is ready!'));

    bot.on('qr', (qr) => {
      console.log('QR RECEIVED');
      QRCodeDisplay.display(qr);
    });

    bot.on('authenticated', () => console.log('authenticated!'));

    bot.on('message', (message) => {
      botMediator.selectMessageCommand(message);
    });

    bot.on('group_join', (groupNotification: GroupNotification) => {
      botMediator.selectGroupNotificationCommand(groupNotification);
    });

    bot.on('change_state', (state) => {
      console.log('meu estado do bot alterou ');
      console.log(state);
    });

    bot.initialize();
  } catch (error) {
    console.log('Error initializing bot and database: ', error);
  }
})();
