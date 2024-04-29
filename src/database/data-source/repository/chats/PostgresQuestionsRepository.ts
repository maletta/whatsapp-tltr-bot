import { ChatEntity } from 'domain/entities/chats/ChatEntity';
import {
  IQuestionDatabaseModel,
  QuestionDTO,
  QuestionEntity,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { UserEntity } from 'domain/entities/users/UserEntity';
import { IQuestionsRepository } from 'domain/interfaces/repositories/chats/IQuestionsRepository';
import { PoolClient } from 'pg';

class PostgresQuestionsRepository extends IQuestionsRepository<PoolClient> {
  public async setConnection(
    connection: PoolClient | Promise<PoolClient>,
  ): Promise<void> {
    this.connection = await connection;
  }

  public getConnection(): PoolClient {
    if (this.connection === null) {
      throw new Error(`Connection not set in ${this.constructor.name}`);
    }
    return this.connection;
  }

  async create(questionDTO: QuestionDTO): Promise<boolean> {
    const { idChat, question, questionColumnType } = questionDTO;
    const connection = this.getConnection();
    const query = `INSERT INTO questions (id_chat, question, question_column_type) 
    VALUES ($1, $2)`;
    const result = await connection.query<QuestionEntity>(query, [
      idChat,
      question,
      questionColumnType,
    ]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async update(questionEntity: QuestionEntity): Promise<boolean> {
    const { id, question, questionColumnType } = questionEntity;
    const connection = this.getConnection();
    const query = `UPDATE question SET 
    question = $2,
    question_column_type = $3,
    WHERE id = $1
    `;
    const result = await connection.query(query, [
      id,
      question,
      questionColumnType,
    ]);

    return result.rowCount !== null && result.rowCount > 0;
  }
  async findById(id: number): Promise<QuestionEntity | null> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM questions WHERE id = $1';
    const result = await connection.query<QuestionEntity>(query, [id]);
    return result.rows[0] || null;
  }

  async findByChatId(id: number): Promise<QuestionEntity[] | null> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM questions where id_chat = $1';
    const result = await connection.query<IQuestionDatabaseModel>(query, [id]);

    if (result.rowCount !== null && result.rowCount > 0)
      return result.rows.map(QuestionEntity.createFromDatabase);

    return null;
  }

  async findByUserAndChat(
    user: UserEntity,
    chat: ChatEntity,
  ): Promise<QuestionEntity[] | null> {
    const { id: userId } = user;
    const { id: chatId } = chat;
    const connection = this.getConnection();
    const query = 'SELECT * FROM questions where id_user = $1 AND id_chat = $2';
    const result = await connection.query<QuestionEntity>(query, [
      userId,
      chatId,
    ]);

    return result.rows || null;
  }
}

export { PostgresQuestionsRepository };
