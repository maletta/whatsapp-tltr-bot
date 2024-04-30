import { IRepositoryConnection } from '../IRepositoryConnection';
import { IUsersDetailsEntityDTO } from 'domain/entities/users/UserDetailsEntity';

abstract class IUsersDetailsRepository<T> extends IRepositoryConnection<T> {
  abstract createOrUpdate(
    user: IUsersDetailsEntityDTO,
  ): Promise<IUsersDetailsEntityDTO | null>;
  abstract delete(id: string): Promise<boolean>;
}

export { IUsersDetailsRepository };
