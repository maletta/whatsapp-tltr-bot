import qrcode from 'qrcode-terminal';

class QRCodeDisplay {
  static display(qr) {
    qrcode.generate(qr, { small: true });
  }
}

export { QRCodeDisplay };
