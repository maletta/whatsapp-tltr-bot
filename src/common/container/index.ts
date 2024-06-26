import { IAnswersRepository } from 'domain/interfaces/repositories/chats/IAnswersRepository';
import { IChatsConfigurationRepository } from 'domain/interfaces/repositories/chats/IChatsConfigurationRepository';
import { IChatsRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUsersDetailsRepository } from 'domain/interfaces/repositories/users/IUserDetailsRepository';
import { IUsersRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { PoolClient } from 'pg';
import { PostgresConnection } from 'src/database/data-source/postgres/PostgresConnection';
import {
  IDataBase,
  PostgresDatabase,
} from 'src/database/data-source/postgres/PostgresDatabase';
import { PostgresAnswerRepository } from 'src/database/data-source/repository/chats/PostgresAnswersRepository';
import { PostgresChatsConfigurationRepository } from 'src/database/data-source/repository/chats/PostgresChatsConfigurationRepository';
import { PostgresChatsRepository } from 'src/database/data-source/repository/chats/PostgresChatsRepository';
import { PostgresQuestionsRepository } from 'src/database/data-source/repository/chats/PostgresQuestionsRepository';
import { PostgresUserDetailsRepository } from 'src/database/data-source/repository/users/PostgresUserDetailsRepository';
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

    container.register<PostgresConnection>(
      'PostgresConnection',
      PostgresConnection,
    );

    container.registerSingleton<IUsersDetailsRepository<PoolClient>>(
      'UsersDetailsRepository',
      PostgresUserDetailsRepository,
    );

    container.registerSingleton<IUsersRepository<PoolClient>>(
      'UsersRepository',
      PostgresUserRepository,
    );

    container.registerSingleton<IChatsRepository<PoolClient>>(
      'ChatsRepository',
      PostgresChatsRepository,
    );

    container.registerSingleton<IChatsConfigurationRepository<PoolClient>>(
      'ChatsConfigurationRepository',
      PostgresChatsConfigurationRepository,
    );

    container.registerSingleton<IQuestionsRepository<PoolClient>>(
      'QuestionsRepository',
      PostgresQuestionsRepository,
    );

    container.registerSingleton<IAnswersRepository<PoolClient>>(
      'AnswersRepository',
      PostgresAnswerRepository,
    );
  } catch (error) {
    console.log('Erro ao se conectar ao banco de dados ', error);
  }
};

export { connectDatabase };
