import { EnumTimeLimit } from './model/TimeLimit';

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

  public hasExpired(timestamp: Date) {
    return timestamp.getTime() < this.timeLimit * 100;
  }
}

export { ISummaryDTO, Summary };

const test = new Summary({
  content: 'content',
  createdAt: new Date('2021-08-31T14:57:09Z'),
  expiresIn: new Date('2021-09-01T14:57:09Z'),
  id: 'test',
  timeLimit: EnumTimeLimit['1_HOUR'],
});

console.log(test);
