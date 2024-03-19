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

    try {
      if (media !== null) {
        const options: MessageSendOptions = { sendMediaAsSticker: true };
        message.reply(media, message.from, options);
      } else {
        message.reply('Marque imagem válida.');
      }
    } catch (error) {
      console.log('Error on transforme image into sticker');
      message.reply('Marque imagem válida.');
    }
  }

  private async getMedia(message: Message): Promise<MessageMedia | null> {
    if (this.isValidType(message) && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();

      if (this.isValidType(quotedMsg)) {
        return quotedMsg.downloadMedia();
      }
    } else if (this.isValidType(message)) {
      return message.downloadMedia();
    }

    return null;
  }

  private isValidType(message: Message): boolean {
    return message.type === MessageTypes.TEXT || message.isGif;
  }
}

export { CommandStickerImage };
