interface IChatEntity {
  id: number;
  whatsappRegistry: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

type ChatEntityDTO = Omit<IChatEntity, 'id' | 'createdAt' | 'updatedAt'>;

interface IChatDatabaseModel {
  id: number;
  whatsapp_registry: string;
  name: string;
  created_at: string;
  updated_at: string;
}
class ChatEntity {
  public id: number;
  public whatsappRegistry: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(chat: IChatEntity) {
    this.id = chat.id;
    this.whatsappRegistry = chat.whatsappRegistry;
    this.name = chat.name;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
  }

  static createFromDatabase(data: IChatDatabaseModel) {
    return new ChatEntity({
      id: data.id,
      whatsappRegistry: data.whatsapp_registry,
      name: data.name,
      updatedAt: new Date(data.updated_at),
      createdAt: new Date(data.created_at),
    });
  }
}

export { ChatEntity };
export type { ChatEntityDTO, IChatDatabaseModel };
