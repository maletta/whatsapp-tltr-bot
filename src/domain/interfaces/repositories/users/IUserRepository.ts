import { UserEntity } from 'domain/entities/users/UserEntity';
import { IRepositoryConnection } from '../IRepositoryConnection';

abstract class IUsersRepository<T> extends IRepositoryConnection<T> {
  abstract create(user: UserEntity): Promise<boolean>;
  abstract update(user: UserEntity): Promise<boolean>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByName(name: string): Promise<UserEntity[]>;
  abstract findByWhatsAppRegistry(registry: string): Promise<UserEntity | null>;
  abstract delete(id: string): Promise<boolean>;
}

export { IUsersRepository };
