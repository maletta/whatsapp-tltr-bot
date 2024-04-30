interface IUsersDetailsEntity {
  idUser: number;
  idChat: number;
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

type IUsersDetailsEntityDTO = IUsersDetailsEntity;

interface IUsersDetailsDatabaseModel {
  id_chat: number;
  id_user: number;
  name: string | null;
  pronoun: string | null;
  age: number | null;
  location: string | null;
  sign: string | null;
  sexual_orientation: string | null;
  relationship: string | null;
  madness_for_love: string | null;
  instagram: string | null;
  photo_url: string | null;
}

class UsersDetailsEntity {
  public idUser: number;
  public idChat: number;
  public name: string | null;
  public pronoun: string | null;
  public age: number | null;
  public location: string | null;
  public sign: string | null;
  public sexualOrientation: string | null;
  public relationship: string | null;
  public madnessForLove: string | null;
  public instagram: string | null;
  public photoUrl: string | null;
  constructor(user: IUsersDetailsEntity) {
    this.idUser = user.idUser;
    this.idChat = user.idChat;
    this.name = user.name;
    this.pronoun = user.pronoun;
    this.age = user.age;
    this.location = user.location;
    this.sign = user.sign;
    this.sexualOrientation = user.sexualOrientation;
    this.relationship = user.relationship;
    this.madnessForLove = user.madnessForLove;
    this.instagram = user.instagram;
    this.photoUrl = user.photoUrl;
  }

  static createFromDatabase(
    data: IUsersDetailsDatabaseModel,
  ): UsersDetailsEntity {
    return new UsersDetailsEntity({
      idChat: data.id_chat,
      idUser: data.id_user,
      name: data.name,
      pronoun: data.pronoun,
      age: data.age,
      location: data.location,
      sign: data.sign,
      sexualOrientation: data.sexual_orientation,
      relationship: data.relationship,
      madnessForLove: data.madness_for_love,
      instagram: data.instagram,
      photoUrl: data.photo_url,
    });
  }

  static createToDatabase(
    data: IUsersDetailsEntityDTO,
  ): IUsersDetailsDatabaseModel {
    return {
      id_chat: data.idChat,
      id_user: data.idUser,
      name: data.name,
      pronoun: data.pronoun,
      age: data.age,
      location: data.location,
      sign: data.sign,
      sexual_orientation: data.sexualOrientation,
      relationship: data.relationship,
      madness_for_love: data.madnessForLove,
      instagram: data.instagram,
      photo_url: data.photoUrl,
    };
  }
}

export { UsersDetailsEntity };
export type { IUsersDetailsEntityDTO, IUsersDetailsDatabaseModel };
