import { EnumTimeLimit } from './TimeLimit';

interface ISummaryDTO {
  id?: string;
  timeLimit: EnumTimeLimit;
  content: string;
  createdAt: Date;
  expiresIn: Date;
}

class Summary {
  public id: string;
  public timeLimit: EnumTimeLimit;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  constructor({ content, createdAt, expiresIn, timeLimit }: ISummaryDTO) {
    this.timeLimit = timeLimit;
    this.content = content;
    this.createdAt = createdAt;
    this.expiresIn = expiresIn;
  }
}

export { ISummaryDTO, Summary };
