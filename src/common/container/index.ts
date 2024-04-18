import { Pool, PoolClient } from 'pg';
import { IDatabase } from 'src/database/data-source/IDataBase';
import { PostgresDatabase } from 'src/database/data-source/postgres/PostgresDatabase';
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
    container.register<IDatabase<Pool, PoolClient>>('IDataBase', {
      useValue: dbWrapper,
    });
  } catch (error) {
    console.log('Erro ao se conectar ao banco de dados ', error);
  }
};

export { connectDatabase };
