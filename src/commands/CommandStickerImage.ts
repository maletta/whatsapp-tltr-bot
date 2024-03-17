import {
  Client,
  Message,
  MessageMedia,
  MessageSendOptions,
  MessageTypes,
} from 'whatsapp-web.js';

import { ICommand } from './ICommand';

class CommandStickerImage implements ICommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    console.log('Command Sticker Image - execute ');
    console.log('args ', args);
    console.log('message ', message.body);

    const media = await this.getMedia(message);

    if (media !== null) {
      const options: MessageSendOptions = { sendMediaAsSticker: true };
      message.reply(media, message.from, options);
    } else {
      message.reply('Marque imagem válida.');
    }
  }

  private async getMedia(message: Message): Promise<MessageMedia | null> {
    if (message.type === MessageTypes.TEXT && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();

      if (quotedMsg.type === MessageTypes.IMAGE) {
        return quotedMsg.downloadMedia();
      }
    }

    if (message.type === MessageTypes.IMAGE) {
      return message.downloadMedia();
    }

    return null;
  }
}

export { CommandStickerImage };
