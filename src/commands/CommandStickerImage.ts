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

    const options: MessageSendOptions = { sendMediaAsSticker: true };
    const media = await this.selectMedia(message);

    if (media !== null) {
      message
        .reply(media, message.from, options)
        .then((reponseMessage) => reponseMessage.react('😼'))
        .catch((error) => {
          console.log('Error on transforme image into sticker');
          console.log(error);
        });
    } else {
      message.reply('Marque imagem válida 😼');
    }
  }

  private selectMedia = async (
    message: Message,
  ): Promise<MessageMedia | null> => {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage();
      return this.getMedia(quotedMessage);
    }

    return this.getMedia(message);
  };

  private async getMedia(message: Message): Promise<MessageMedia | null> {
    try {
      if (this.isValidType(message)) {
        return message.downloadMedia();
      }
      return null;
    } catch (error) {
      console.log('Error on download media');
      console.log(error);
      return null;
    }
  }

  private isValidType(message: Message): boolean {
    return (
      (message.hasMedia && message.type === MessageTypes.TEXT) || message.isGif
    );
  }
}

export { CommandStickerImage };
