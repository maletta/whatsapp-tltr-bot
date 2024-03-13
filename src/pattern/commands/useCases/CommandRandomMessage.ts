import { Client, Message } from 'whatsapp-web.js';

import { createNonStreamingMultipartContent } from '../../../functions/askVertexAi';
import { ICommand } from '../ICommand';

class CommandRandomMessage implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Random Message - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const promptJoke = 'conte uma piada aleatória';
    const promptFunFact = 'fale uma curiosidade aleatória sobre qualquer coisa';

    const prompt = Date.now() % 2 ? promptFunFact : promptJoke;

    const response = await createNonStreamingMultipartContent(prompt, '');

    message.reply(response);
  }
}

export { CommandRandomMessage };
