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

    message.reply(`*${media.filename}*\n\nSending sticker...`);

    console.log('-----------', message);
    if (media !== null && media !== undefined) {
      console.log('response media to sticker');
      // console.log(media);
      message
        .reply(media, message.from, options)
        // .then((reponseMessage) => reponseMessage.react('😴')) // 😼
        .catch((error) => {
          console.log('Error on transforme image into sticker');
          console.log(error);
        });
    } else {
      message.reply('Marque imagem válida 😴'); // 😼
    }
  }

  private selectMedia = async (
    message: Message,
  ): Promise<MessageMedia | null> => {
    console.log('select media function');
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage();
      console.log('downloaded quoted Media ');
      const media = await this.getMedia(quotedMessage)
        .then((response) => {
          console.log('sucesso ao Get Media', response);
          return response;
        })
        .catch((error) => {
          console.log('error on download media ', error);
          return null;
        });
      console.log(media);
      return media;
    }
    console.log('downloaded message media  ');
    const media = await this.getMedia(message);
    console.log(media);

    return media;
  };

  private async getMedia(message: Message): Promise<MessageMedia | null> {
    console.log('Get Media function');
    try {
      if (this.isValidType(message)) {
        const media = await message.downloadMedia();
        return media;
      }
      return null;
    } catch (error) {
      console.log('Error on download media');
      console.log(error);
      return null;
    }
  }

  private isValidType = (message: Message): boolean => {
    console.log('isValidType ', message.hasMedia, message.type, message.isGif);
    return (
      // (message.hasMedia && message.type === MessageTypes.IMAGE) || message.isGif
      (message.hasMedia &&
        (message.type === MessageTypes.IMAGE ||
          message.type === MessageTypes.VIDEO)) ||
      message.isGif
    );
  };
}

export { CommandStickerImage };
