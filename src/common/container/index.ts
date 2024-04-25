import { IUserRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { Pool, PoolClient } from 'pg';
import {
  IDataBase,
  PostgresDatabase,
} from 'src/database/data-source/postgres/PostgresDatabase';
import { PostgresUserRepository } from 'src/database/data-source/repository/users/PostgresUserRepository';
import { container } from 'tsyringe';

const connectDatabase = async () => {
  try {
    const dbWrapper = new PostgresDatabase({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await dbWrapper.init();

    // container.registerSingleton<IDatabaseWrapper>('DatabaseWrapper', dbWrapper);
    container.register<IDataBase<PoolClient>>('IDataBase', {
      useValue: dbWrapper,
    });

    container.registerSingleton<IUserRepository<PoolClient>>(
      'UserRepository',
      PostgresUserRepository,
    );
  } catch (error) {
    console.log('Erro ao se conectar ao banco de dados ', error);
  }
};

export { connectDatabase };
