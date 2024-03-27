const atob_1 = require('atob');
const axios_1 = require('axios');
const crypto_1 = require('crypto');
const futoin_hkdf_1 = require('futoin-hkdf');

const makeOptions = function (useragentOverride) {
  return {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': processUA(useragentOverride),
      DNT: 1,
      'Upgrade-Insecure-Requests': 1,
      origin: 'https://web.whatsapp.com/',
      referer: 'https://web.whatsapp.com/',
    },
  };
};
const nonSizeTypes = ['sticker'];
const timeout = function (ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms);
  });
};
exports.mediaTypes = {
  IMAGE: 'Image',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  PTT: 'Audio',
  DOCUMENT: 'Document',
  STICKER: 'Image',
};
const MissingCriticalDataError = (function (_super) {
  __extends(MissingCriticalDataError, _super);
  function MissingCriticalDataError(message) {
    const _this = _super.call(this) || this;
    _this.message = message;
    _this.name = 'MissingCriticalDataError';
    _this.message = message;
    return _this;
  }
  return MissingCriticalDataError;
})(Error);
exports.MissingCriticalDataError = MissingCriticalDataError;
const decryptMedia = function (message, useragentOverride) {
  return __awaiter(void 0, void 0, void 0, function () {
    let options;
    let missingProps;
    let haventGottenImageYet;
    let res;
    let error_1;
    let buff;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          options = makeOptions(useragentOverride);
          if (!message || message === false || typeof message === 'boolean')
            return [2, new Error('Message is not a valid message')];
          missingProps = [];
          message = message;
          if (!message.mediaKey) missingProps.push('mediaKey');
          if (!message.filehash) missingProps.push('filehash');
          if (!message.mimetype) missingProps.push('mimetype');
          if (!message.type) missingProps.push('type');
          if (!message.size) missingProps.push('size');
          if (
            !message ||
            !message.mediaKey ||
            !message.filehash ||
            !message.mimetype ||
            !message.type ||
            !message.size
          ) {
            if (missingProps.length == 1 && missingProps[0] === 'size') {
              if (!nonSizeTypes.includes(message.type))
                console.warn(
                  '@open-wa/wa-decrypt - WARN: size property is missing. File will fail an integrity check.',
                );
            } else
              throw new MissingCriticalDataError(
                'Message is missing critical data: '.concat(
                  missingProps.join(', '),
                ),
              );
          }
          haventGottenImageYet = true;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 9, , 10]);
          _a.label = 2;
        case 2:
          if (!haventGottenImageYet) return [3, 8];
          return [
            4,
            axios_1.default.get(message.deprecatedMms3Url.trim(), options),
          ];
        case 3:
          res = _a.sent();
          if (!(res.status == 200)) return [3, 4];
          haventGottenImageYet = false;
          return [3, 7];
        case 4:
          if (!(res.status == 404)) return [3, 5];
          console.error(
            'This media does not exist, or is no longer available on the server. Please see: https://docs.openwa.dev/pages/How%20to/decrypt-media.html#40439d',
          );
          haventGottenImageYet = false;
          return [3, 7];
        case 5:
          return [4, timeout(2000)];
        case 6:
          _a.sent();
          _a.label = 7;
        case 7:
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          error_1 = _a.sent();
          throw error_1;
        case 10:
          buff = Buffer.from(res.data, 'binary');
          return [
            2,
            magix(
              buff,
              message.mediaKey,
              message.type,
              message.size,
              message.mimetype,
            ),
          ];
      }
    });
  });
};
exports.decryptMedia = decryptMedia;
var processUA = function (userAgent) {
  let ua =
    userAgent ||
    'WhatsApp/2.16.352 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36';
  if (!ua.includes('WhatsApp')) ua = `WhatsApp/2.16.352 ${ua}`;
  return ua;
};
var magix = function (
  fileData,
  mediaKeyBase64,
  mediaType,
  expectedSize,
  mimetype,
) {
  const encodedHex = fileData.toString('hex');
  const encodedBytes = hexToBytes(encodedHex);
  const mediaKeyBytes = base64ToBytes(mediaKeyBase64);
  const info = 'WhatsApp '.concat(
    exports.mediaTypes[mediaType.toUpperCase()] ||
      exports.mediaTypes[
        Object.keys(exports.mediaTypes).filter(function (type) {
          return mimetype.includes(type.toLowerCase());
        })[0]
      ],
    ' Keys',
  );
  const hash = 'sha256';
  const salt = new Uint8Array(32);
  const expandedSize = 112;
  const mediaKeyExpanded = (0, futoin_hkdf_1.default)(
    mediaKeyBytes,
    expandedSize,
    {
      salt,
      info,
      hash,
    },
  );
  const iv = mediaKeyExpanded.slice(0, 16);
  const cipherKey = mediaKeyExpanded.slice(16, 48);
  const decipher = crypto_1.default.createDecipheriv(
    'aes-256-cbc',
    cipherKey,
    iv,
  );
  const decoded = decipher.update(encodedBytes);
  const mediaDataBuffer = expectedSize
    ? fixPadding(decoded, expectedSize)
    : decoded;
  return mediaDataBuffer;
};
var fixPadding = function (data, expectedSize) {
  const padding = (16 - (expectedSize % 16)) & 0xf;
  if (padding > 0) {
    if (expectedSize + padding == data.length) {
      data = data.slice(0, data.length - padding);
    } else if (data.length + padding == expectedSize) {
      const arr = new Uint16Array(padding).map(function () {
        return padding;
      });
      data = Buffer.concat([data, Buffer.from(arr)]);
    }
  }
  return Buffer.from(data, 'utf-8');
};
var hexToBytes = function (hexStr) {
  const intArray = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    intArray.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return new Uint8Array(intArray);
};
const base64ToBytes = function (base64Str) {
  const binaryStr = (0, atob_1.default)(base64Str);
  const byteArray = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    byteArray[i] = binaryStr.charCodeAt(i);
  }
  return byteArray;
};
//
// teste
