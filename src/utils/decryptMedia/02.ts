/* eslint-disable no-useless-catch */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import atob from 'atob';
import axios, { AxiosResponse } from 'axios';
import { IMessageRaw } from 'common/RawMessageType';
import crypto from 'crypto';
import hkdf from 'futoin-hkdf';

const fixPadding = (data: Buffer, expectedSize: number): Buffer => {
  // eslint-disable-next-line no-bitwise
  const padding = (16 - (expectedSize % 16)) & 0xf;
  let newData: Buffer = data;
  if (padding > 0) {
    if (expectedSize + padding === data.length) {
      newData = data.slice(0, data.length - padding);
      // newData = Uint8Array.prototype.slice.call(data, 0, data.length - padding);
    } else if (data.length + padding === expectedSize) {
      const arr = new Uint16Array(padding).map(() => padding);
      newData = Buffer.concat([data, Buffer.from(arr)]);
    }
  }

  return Buffer.from(newData);
};

const processUA = (userAgent?: string) => {
  let ua =
    userAgent ||
    'WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36';
  if (!ua.includes('WhatsApp')) ua = `WhatsApp/2.16.352 ${ua}`;
  return ua;
};

const makeOptions = (useragentOverride?: string) => {
  return {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': processUA(useragentOverride),
      DNT: '1',
      'Upgrade-Insecure-Requests': '1',
      origin: 'https://web.whatsapp.com/',
      referer: 'https://web.whatsapp.com/',
    },
  };
};

const nonSizeTypes: string[] = ['sticker'];

const timeout = (ms: number) => {
  return new Promise<void>((res) => {
    setTimeout(res, ms);
  });
};

const mediaTypes = {
  IMAGE: 'Image',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  PTT: 'Audio',
  DOCUMENT: 'Document',
  STICKER: 'Image',
};

class MissingCriticalDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingCriticalDataError';
  }
}

const base64ToBytes = (base64Str) => {
  const binaryStr = atob(base64Str);
  const byteArray = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i += 1) {
    byteArray[i] = binaryStr.charCodeAt(i);
  }
  return byteArray;
};

const hexToBytes = (hexStr) => {
  const intArray = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    intArray.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return new Uint8Array(intArray);
};

const magix = (
  fileData: Buffer,
  mediaKeyBase64: string,
  mediaType: string,
  expectedSize: number,
  mimetype: string,
): Buffer => {
  const encodedHex = fileData.toString('hex');
  const encodedBytes = hexToBytes(encodedHex);
  const mediaKeyBytes = base64ToBytes(mediaKeyBase64);
  const info = `WhatsApp ${
    mediaTypes[mediaType.toUpperCase()] ||
    mediaTypes[
      Object.keys(mediaTypes).filter((type) =>
        mimetype.includes(type.toLowerCase()),
      )[0]
    ]
  } Keys`;
  const hash = 'sha256';
  const salt = new Uint8Array(32);
  const expandedSize = 112;

  // const mediaKeyExpanded = hkdf(mediaKeyBytes, expandedSize, {
  //   salt,
  //   info,
  //   hash,
  // });

  const mediaKeyExpanded = hkdf(Buffer.from(mediaKeyBytes), expandedSize, {
    salt: Buffer.from(salt),
    info,
    hash,
  });

  const iv = mediaKeyExpanded.slice(0, 16);
  const cipherKey = mediaKeyExpanded.slice(16, 48);

  const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
  const decoded = decipher.update(encodedBytes);

  const mediaDataBuffer = expectedSize
    ? fixPadding(decoded, expectedSize)
    : decoded;

  return mediaDataBuffer;
};

export const decryptMedia = async (
  message: IMessageRaw,
  useragentOverride?: string,
): Promise<Buffer> => {
  const options = makeOptions(useragentOverride);

  if (!message || typeof message === 'boolean') {
    throw new Error('Message is not a valid message');
  }

  const missingProps: string[] = [];

  if (!message.mediaKey) missingProps.push('mediaKey');
  if (!message._data.filehash) missingProps.push('filehash');
  if (!message._data.filehash) missingProps.push('mimetype');
  if (!message.type) missingProps.push('type');
  if (!message._data.size) missingProps.push('size');

  if (
    !message ||
    !message.mediaKey ||
    !message._data.filehash ||
    !message._data.mimetype ||
    !message.type ||
    !message._data.size
  ) {
    if (missingProps.length === 1 && missingProps[0] === 'size') {
      if (!nonSizeTypes.includes(message.type)) {
        console.warn(
          '@open-wa/wa-decrypt - WARN: size property is missing. File will fail an integrity check.',
        );
      }
    } else {
      throw new MissingCriticalDataError(
        `Message is missing critical data: ${missingProps.join(', ')}`,
      );
    }
  }

  let haventGottenImageYet = true;

  let res: AxiosResponse<ArrayBuffer>;
  while (haventGottenImageYet) {
    try {
      res = await axios.get(message._data.deprecatedMms3Url.trim(), {
        headers: options.headers,
        responseType: 'arraybuffer',
      });

      if (res.status === 200) {
        haventGottenImageYet = false;
      } else if (res.status === 404) {
        console.error(
          'This media does not exist, or is no longer available on the server. Please see: https://docs.openwa.dev/pages/How%20to/decrypt-media.html#40439d',
        );
        haventGottenImageYet = false;
      } else {
        await timeout(2000);
      }
    } catch (error) {
      throw error;
    }
  }

  // const buff: Buffer = Buffer.from(res.data, 'binary');
  const buff: Buffer = Buffer.from(res.data);
  return magix(
    buff,
    message.mediaKey,
    message.type,
    message._data.size,
    message._data.mimetype,
  );
};
