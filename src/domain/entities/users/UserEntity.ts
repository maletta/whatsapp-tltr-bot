interface IUserEntity {
  readonly id: number;
  readonly whatsappRegistry: string;
  readonly cellphone: string;
  infoName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type UserEntityDTO = Omit<IUserEntity, 'id' | 'createdAt' | 'updatedAt'>;

interface IUserEntityDatabaseModel {
  id: number;
  whatsapp_registry: string;
  cellphone: string;
  info_name: string;
  created_at: string;
  updated_at: string;
}

class UserEntity {
  public readonly id: number;
  public readonly whatsappRegistry: string;
  public readonly cellphone: string;
  public infoName: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(user: IUserEntity) {
    this.id = user.id;
    this.whatsappRegistry = user.whatsappRegistry;
    this.cellphone = user.cellphone;
    this.infoName = user.infoName;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  public static createFromDatabase(data: IUserEntityDatabaseModel): UserEntity {
    return new UserEntity({
      id: data.id,
      whatsappRegistry: data.whatsapp_registry,
      cellphone: data.cellphone,
      infoName: data.info_name,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }
}

export { UserEntity };
export type { UserEntityDTO, IUserEntityDatabaseModel };
