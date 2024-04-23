import { UserEntity } from 'domain/entities/users/UserEntity';
import { IBasePostgresRepository } from 'src/database/data-source/postgres/interfaces/IBasePostgresRepository';

export interface IUserRepository extends IBasePostgresRepository<UserEntity> {
  // create(contact: UserEntity): Promise<void>;
  // update(contact: UserEntity): Promise<void>;
  // findById(id: string): Promise<UserEntity | null>;
  // findByName(name: string): Promise<UserEntity[]>;
  // delete(id: string): Promise<void>;
}
