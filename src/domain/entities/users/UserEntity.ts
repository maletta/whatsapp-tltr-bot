interface IUserEntity {
  readonly id: number;
  readonly whatsappRegistry: string;
  readonly cellphone: string;
  infoName: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

type UserEntityDTO = Omit<IUserEntity, 'id' | 'createdAt' | 'updatedAt'>;

class UserEntity {
  public readonly id: number;
  public readonly whatsappRegistry: string;
  public readonly cellphone: string;
  public infoName: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(user: IUserEntity) {
    this.id = user.id;
    this.whatsappRegistry = user.whatsappRegistry;
    this.cellphone = user.cellphone;
    this.infoName = user.infoName;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

interface IUsersDetailsEntity {
  id_user: number;
  id_chat: number;
  name: string | null;
  pronoun: string | null;
  age: number | null;
  location: string | null;
  sign: string | null;
  sexualOrientation: string | null;
  relationship: string | null;
  madnessForLove: string | null;
  instagram: string | null;
  photoUrl: string | null;
}

class UsersDetailsEntity {
  public id_user: number;
  public id_chat: number;
  public name: string | null;
  public pronoun: string | null;
  public age: number | null;
  public location: string | null;
  public sign: string | null;
  public sexual_orientation: string | null;
  public relationship: string | null;
  public madnessForLove: string | null;
  public instagram: string | null;
  public photoUrl: string | null;
  constructor(user: IUsersDetailsEntity) {
    this.id_user = user.id_user;
    this.id_chat = user.id_chat;
    this.name = user.name;
    this.pronoun = user.pronoun;
    this.age = user.age;
    this.location = user.location;
    this.sign = user.sign;
    this.sexual_orientation = user.sexualOrientation;
    this.relationship = user.relationship;
    this.madnessForLove = user.madnessForLove;
    this.instagram = user.instagram;
    this.photoUrl = user.photoUrl;
  }
}

export { UserEntity, UsersDetailsEntity };
export type { UserEntityDTO };
