import { IMessageRaw } from 'common/RawMessageType';
import { decryptMedia } from 'utils/decryptMedia';
import {
  Client,
  Message,
  MessageMedia,
  MessageSendOptions,
  MessageTypes,
} from 'whatsapp-web.js';

import { IMessageCommand } from './interfaces/ICommand';
import { MimeTypesEnum } from 'domain/enums/MimeTypes';

class CommandStickerImage implements IMessageCommand {
  async execute(
    args: string[],
    client: Client,
    message: Message,
  ): Promise<void> {
    const options: MessageSendOptions = { sendMediaAsSticker: true };
    const media = await this.selectMedia(message);

    if (media !== null && media !== undefined) {
      message
        .reply(media, message.from, options)
        .then((reponseMessage) => reponseMessage.react('😼')) // 😼
        .catch((error) => {
          console.log('Error on transforme image into sticker');
          console.log(error);
        });
    } else {
      message.reply('Marque imagem válida 😼'); // 😼
    }
  }

  private selectMedia = async (
    message: Message,
  ): Promise<MessageMedia | null> => {
    let selectedMessage: Message = message;
    if (message.hasQuotedMsg) {
      selectedMessage = await message.getQuotedMessage();
    }

    const media = await this.getMedia(selectedMessage);

    return media;
  };

  private async getMedia(message: Message): Promise<MessageMedia | null> {
    console.log('Get Media function');
    try {
      if (!this.isValidType(message)) {
        return null;
      }

      const mimetype = this.getMimeType(message);
      const mediaBuffered = await decryptMedia(
        message as unknown as IMessageRaw,
      );

      if (!mediaBuffered) {
        return null;
      }

      const messageMedia = new MessageMedia(
        mimetype,
        mediaBuffered.toString('base64'),
      );

      return messageMedia;
    } catch (error) {
      console.log('Error on decrypt and create media');
      console.log(error);
      return null;
    }
  }

  private isValidType = (message: Message): boolean => {
    return (
      (message.hasMedia &&
        (message.type === MessageTypes.IMAGE ||
          message.type === MessageTypes.VIDEO)) ||
      message.isGif
    );
  };

  private getMimeType = (message: Message): MimeTypesEnum => {
    if (message.type === MessageTypes.VIDEO) {
      return MimeTypesEnum.VIDEO;
    }
    return MimeTypesEnum.PNG;
  };
}

export { CommandStickerImage };
