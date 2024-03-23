import { Client, LocalAuth } from 'whatsapp-web.js';

abstract class WhatsAppClient {
  private static client: Client;

  private static initializeEvents() {
    WhatsAppClient.client.on('ready', () => console.log('client is ready!'));
    WhatsAppClient.client.on('authenticated', () =>
      console.log('client is authenticated v4'),
    );
  }

  public static getClient(): Client {
    if (WhatsAppClient.client === null || WhatsAppClient.client === undefined) {
      WhatsAppClient.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        ffmpegPath: '/usr/bin/ffmpeg',
        webVersion: '2.2409.2',
        webVersionCache: {
          type: 'remote',
          remotePath:
            'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html',
        },
      });
    }

    return WhatsAppClient.client;
  }

  public initialize() {
    try {
      WhatsAppClient.initializeEvents();
      WhatsAppClient.client.initialize();
    } catch (erro) {
      console.log(erro);
    }
  }
}

export { WhatsAppClient };
