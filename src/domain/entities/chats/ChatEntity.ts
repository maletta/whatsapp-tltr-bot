interface IChatEntity {
  id: number;
  whatsappRegistry: number;
  name: string;
  createdAt: Date;
}

type ChatEntityDTO = Omit<IChatEntity, 'id' | 'createdAt'>;

class ChatEntity {
  public id: number;
  public whatsappRegistry?: number;
  public name: string;
  public createdAt: Date;

  constructor(chat: IChatEntity) {
    this.id = chat.id;
    this.whatsappRegistry = chat.whatsappRegistry;
    this.name = chat.name;
    this.createdAt = chat.createdAt;
  }
}

export { ChatEntity };
export type { ChatEntityDTO };
