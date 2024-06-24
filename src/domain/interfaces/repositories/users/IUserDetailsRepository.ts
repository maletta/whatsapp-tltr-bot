import { IRepositoryConnection } from '../IRepositoryConnection';
import {
  IUsersDetailsEntityDTO,
  UsersDetailsEntity,
} from 'domain/entities/users/UserDetailsEntity';

abstract class IUsersDetailsRepository<T> extends IRepositoryConnection<T> {
  abstract createOrUpdate(
    user: IUsersDetailsEntityDTO,
  ): Promise<UsersDetailsEntity | null>;
  abstract delete(id: string): Promise<boolean>;
}

export { IUsersDetailsRepository };
