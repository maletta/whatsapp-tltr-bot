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
}

export { UsersDetailsEntity };
