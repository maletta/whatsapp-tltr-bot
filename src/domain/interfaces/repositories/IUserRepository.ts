import { UserEntity } from 'domain/entities/users/UserEntity';

export interface IUserRepository {
  create(contact: UserEntity): Promise<void>;
  update(contact: UserEntity): Promise<void>;
  findById(id: string): Promise<UserEntity | null>;
  findByName(name: string): Promise<UserEntity[]>;
  delete(id: string): Promise<void>;
}
