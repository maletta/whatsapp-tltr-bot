/* eslint-disable no-restricted-syntax */
import dotenv from 'dotenv';

import { QRCodeDisplay } from './QRCodeDisplay';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

// askChatGPT('olá eu gosto de azul');

console.log('v2');

// makeRequest();
// createNonStreamingMultipartContent('mensagem para resumir');

const bot = WhatsAppClient.getClient();

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED', QRCodeDisplay.display(qr));
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('message', (message) => {
  // onMessage(bot, message)
  const { from } = message;

  console.log('Embed criado com sucesso!'); // Adicione uma mensagem mais descritiva

  const botao1 = {
    type: 'button',
    buttonText: {
      text: 'Botão 1',
    },
    event: {
      type: 'reply',
      reply: {
        title: 'Botão 1 pressionado',
        text: 'Você pressionou o botão 1!',
      },
    },
  };

  const botao2 = {
    type: 'button',
    buttonText: {
      text: 'Botão 2',
    },
    event: {
      type: 'reply',
      reply: {
        title: 'Botão 2 pressionado',
        text: 'Você pressionou o botão 2!',
      },
    },
  };

  const codigoBotoes = {
    type: 'buttons',
    buttons: [botao1, botao2],
  };

  bot.sendMessage(from, JSON.stringify(codigoBotoes));
});

bot.initialize();

// sudo ssh -i ~/.ssh/my-aws/CHAVE-WHATSAPP-BOT.pem ec2-user@ip-public
