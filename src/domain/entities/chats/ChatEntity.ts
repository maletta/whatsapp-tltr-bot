interface IChatConfigurationDatabaseModel {
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

type IChatEntityWithoutConfiguration = IBaseChatEntity;
type IChatEntity = IChatEntityWithoutConfiguration & IChatConfigurationEntity;

type ChatEntityDTO = Omit<IBaseChatEntity, 'id' | 'createdAt' | 'updatedAt'>;

interface IBaseChatDatabaseModel {
  id: number;
  whatsapp_registry: string;
  name: string;
  created_at: string;
  updated_at: string;
}

type IChatWithoutConfigurationDatabaseModel = IBaseChatDatabaseModel;
type IChatDatabaseModel = IChatWithoutConfigurationDatabaseModel &
  IChatConfigurationDatabaseModel;

class ChatEntityWithoutConfiguration {
  public id: number;
  public whatsappRegistry: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(chat: IChatEntityWithoutConfiguration) {
    this.id = chat.id;
    this.whatsappRegistry = chat.whatsappRegistry;
    this.name = chat.name;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
  }

  static createFromDatabase(data: IChatWithoutConfigurationDatabaseModel) {
    return new ChatEntityWithoutConfiguration({
      id: data.id,
      whatsappRegistry: data.whatsapp_registry,
      name: data.name,
      updatedAt: new Date(data.updated_at),
      createdAt: new Date(data.created_at),
    });
  }
}

class ChatEntity
  extends ChatEntityWithoutConfiguration
  implements IChatConfigurationEntity
{
  constructor(chat: IChatEntity) {
    super(chat);
    this.notifyNewUserDetail = chat.notifyNewUserDetail;
    this.onlyRegisteredUserMode = chat.onlyRegisteredUserMode;
  }
  notifyNewUserDetail: boolean;
  onlyRegisteredUserMode: boolean;

  static createFromDatabase(data: IChatDatabaseModel) {
    return new ChatEntity({
      id: data.id,
      whatsappRegistry: data.whatsapp_registry,
      name: data.name,
      updatedAt: new Date(data.updated_at),
      createdAt: new Date(data.created_at),
      notifyNewUserDetail: data.notify_new_user_detail,
      onlyRegisteredUserMode: data.only_registered_user_mode,
    });
  }
}

class ChatConfigurationEntity implements IChatConfigurationEntity {
  notifyNewUserDetail: boolean;
  onlyRegisteredUserMode: boolean;

  constructor(configuration: IChatConfigurationEntity) {
    this.notifyNewUserDetail = configuration.notifyNewUserDetail;
    this.onlyRegisteredUserMode = configuration.onlyRegisteredUserMode;
  }

  static createFromDatabase(data: IChatConfigurationDatabaseModel) {
    return new ChatConfigurationEntity({
      notifyNewUserDetail: data.notify_new_user_detail,
      onlyRegisteredUserMode: data.only_registered_user_mode,
    });
  }
}

export { ChatEntity, ChatEntityWithoutConfiguration, ChatConfigurationEntity };
export type {
  ChatEntityDTO,
  IChatDatabaseModel,
  IChatConfigurationDatabaseModel,
  IChatWithoutConfigurationDatabaseModel,
};
