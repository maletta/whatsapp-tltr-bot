import {
  AnswerDTO,
  AnswerEntity,
  QuestionEntity,
} from 'domain/entities/chats/QuestionsAndAnswersEntity';
import { IAnswersRepository } from 'domain/interfaces/repositories/chats/IAnswersRepository';
import { PoolClient } from 'pg';

class PostgresAnswerRepository extends IAnswersRepository<PoolClient> {
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

  async create(answerDTO: AnswerDTO): Promise<boolean> {
    const { answer, idQuestion, idUser } = answerDTO;
    const connection = this.getConnection();
    const query =
      'INSERT INTO answers (id_question, id_user, answer) VALUES ($1,$2,$3)';
    const result = await connection.query(query, [idQuestion, idUser, answer]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async update(answerEntity: AnswerEntity): Promise<boolean> {
    const { id, answer } = answerEntity;
    const connection = this.getConnection();
    const query = 'UPDATE answers SET answer = $2 where id =$1';
    const result = await connection.query(query, [id, answer]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async findById(id: number): Promise<AnswerEntity | null> {
    const connection = this.getConnection();
    const query = 'SELECT * FROM answers WHERE id = $1';
    const result = await connection.query<AnswerEntity>(query, [id]);
    if (result.rowCount === 0) return null;

    return new AnswerEntity(result.rows[0]);
  }

  async findByUserAndChat(
    userId: string,
    chatId: string,
  ): Promise<AnswerEntity[] | null> {
    const connection = this.getConnection();
    const query = `
    SELECT * FROM answers a
    INNER JOIN questions q
    on a.id_question = q.id
    WHERE a.id_user = $1 AND q.id_chat = $2
    `;
    const result = await connection.query(query, [userId, chatId]);
    if (result.rowCount === 0) return null;

    return result.rows.map((row) => new AnswerEntity(row));
  }

  async findByQuestions(
    questions: QuestionEntity[],
  ): Promise<AnswerEntity[] | null> {
    const connection = this.getConnection();
    const ids = questions.map((question) => question.id);
    const query = 'SELECT * FROM answers where id_question ANY($1)';
    const result = await connection.query(query, [ids]);
    if (result.rowCount === 0) return null;

    return result.rows.map((row) => new AnswerEntity(row));
  }
}

export { PostgresAnswerRepository };
