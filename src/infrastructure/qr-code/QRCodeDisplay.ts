import qrcode from 'qrcode-terminal';

class QRCodeDisplay {
  static display(qr: string) {
    qrcode.generate(qr, { small: true });
  }
}

export { QRCodeDisplay };
