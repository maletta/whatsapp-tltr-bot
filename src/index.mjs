import wwjsPkg from "whatsapp-web.js";
import { QRCodeDisplay } from "./QRCodeDisplay.mjs";
import dotenv from "dotenv";

dotenv.config();

const { Client, LocalAuth } = wwjsPkg;

const client = new Client({
  // puppeteer: { headless: true },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", QRCodeDisplay.display(qr));
});

client.on("authenticated", () => {
  console.log("Authentication successful! ");
  console.log();
});

client.on("remote_session_saved", (session) => {
  console.log("remote_session_saved ", session);
});

client.on("ready", async () => {
  console.log("Client is ready!");
  const isGroup = Boolean(process.env.IS_GROUP);
  const chatName = process.env.CHAT_NAME;
  const chatCreateTimestamp = Number(process.env.CHAT_CREATION_TIMESTAMP);

  const chat = await client.getChats().then((chats) => {
    const filteredChats = chats.filter((c) => {
      if (c.name === chatName) {
        if (
          c.isGroup &&
          c.groupMetadata &&
          c.groupMetadata.creation === chatCreateTimestamp
        ) {
          return true;
        }
      }

      return false;
    });

    return filteredChats;
  });

  console.log(chat);
});

client.initialize();
