import dotenv from 'dotenv';
import OpenAI from 'openai';

import { onMessage } from './functions/onMessage';
import { QRCodeDisplay } from './QRCodeDisplay';
import { WhatsAppClient } from './WhatsAppClient';

dotenv.config();

const openai = new OpenAI();

async function main() {
  try {
    const stream = await openai.chat.completions.create({
      model: 'text-davinci-002',
      messages: [{ role: 'user', content: 'Say this is a test' }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  } catch (e) {
    console.log(e);
  }
}

main();

console.log('v2');

const bot = WhatsAppClient.getClient();

bot.on('ready', () => console.log('client is ready!'));

bot.on('qr', (qr) => {
  console.log('QR RECEIVED', QRCodeDisplay.display(qr));
});

bot.on('authenticated', () => console.log('authenticated!'));

bot.on('message', (message) => onMessage(bot, message));

bot.initialize();

// sudo ssh -i ~/.ssh/my-aws/CHAVE-WHATSAPP-BOT.pem ec2-user@ip-public
