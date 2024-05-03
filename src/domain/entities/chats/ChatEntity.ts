interface ChatConfigurationDatabaseModel {
  notify_new_user_detail: boolean;
  only_registered_user_mode: boolean;
}

interface IChatConfigurationEntity {
  notifyNewUserDetail: boolean;
  onlyRegisteredUserMode: boolean;
}

interface IBaseChatEntity {
  id: number;
  whatsappRegistry: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

type IChatEntity = IBaseChatEntity & IChatConfigurationEntity;

type ChatEntityDTO = Omit<IBaseChatEntity, 'id' | 'createdAt' | 'updatedAt'>;

interface IBaseChatDatabaseModel {
  id: number;
  whatsapp_registry: string;
  name: string;
  created_at: string;
  updated_at: string;
}

type IChatDatabaseModel = IBaseChatDatabaseModel & IChatConfigurationEntity;
class ChatEntity implements IChatConfigurationEntity {
  public id: number;
  public whatsappRegistry: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;
  public notifyNewUserDetail: boolean;
  public onlyRegisteredUserMode: boolean;

  constructor(chat: IChatEntity) {
    this.id = chat.id;
    this.whatsappRegistry = chat.whatsappRegistry;
    this.name = chat.name;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
    this.notifyNewUserDetail = chat.notifyNewUserDetail;
    this.onlyRegisteredUserMode = chat.onlyRegisteredUserMode;
  }

  static createFromDatabase(data: IChatDatabaseModel) {
    return new ChatEntity({
      id: data.id,
      whatsappRegistry: data.whatsapp_registry,
      name: data.name,
      updatedAt: new Date(data.updated_at),
      createdAt: new Date(data.created_at),
      notifyNewUserDetail: data.notifyNewUserDetail,
      onlyRegisteredUserMode: data.onlyRegisteredUserMode,
    });
  }
}

export { ChatEntity };
export type { ChatEntityDTO, IChatDatabaseModel };
