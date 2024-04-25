import { IAnswerRepository } from 'domain/interfaces/repositories/chats/IAnswersRepository';
import { IChatRepository } from 'domain/interfaces/repositories/chats/IChatsRepository';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { IUserRepository } from 'domain/interfaces/repositories/users/IUserRepository';
import { Pool, PoolClient } from 'pg';
import {
  IDataBase,
  PostgresDatabase,
} from 'src/database/data-source/postgres/PostgresDatabase';
import { PostgresAnswerRepository } from 'src/database/data-source/repository/chats/PostgresAnswerRepository';
import { PostgresChatRepository } from 'src/database/data-source/repository/chats/PostgresChatRepository';
import { PostgresQuestionRepository } from 'src/database/data-source/repository/chats/PostgresQuestionRepository';
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

    container.registerSingleton<IChatRepository<PoolClient>>(
      'ChatRepository',
      PostgresChatRepository,
    );

    container.registerSingleton<IQuestionsRepository<PoolClient>>(
      'QuestionRepository',
      PostgresQuestionRepository,
    );

    container.registerSingleton<IAnswerRepository<PoolClient>>(
      'QuestionRepository',
      PostgresAnswerRepository,
    );
  } catch (error) {
    console.log('Erro ao se conectar ao banco de dados ', error);
  }
};

export { connectDatabase };
