import { Client } from 'whatsapp-web.js';

import { IChat } from '../@types/augmentation';

async function getChats(client: Client, chatName: string): Promise<IChat[]> {
  const chat: IChat[] = (await client.getChats().then((chats) => {
    const filteredChats = chats.filter((c) => {
      const chatAugmented = c as unknown as IChat;
      if (chatAugmented.name === chatName) {
        if (
          chatAugmented.isGroup &&
          chatAugmented.groupMetadata
          // chatAugmented.groupMetadata.creation === chatCreateTimestamp
        ) {
          return true;
        }
      }

      return false;
    });

    return filteredChats;
  })) as IChat[];

  return chat;
}

export { getChats };
