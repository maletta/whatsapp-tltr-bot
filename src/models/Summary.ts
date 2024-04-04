import { EnumTimeLimit } from 'enums/TimeLimit';

import { BaseModel } from './BaseModel';

interface ISummaryDTO {
  key: EnumTimeLimit;
  content: string;
  createdAt?: Date;
}

class Summary extends BaseModel<EnumTimeLimit> {
  constructor({ content, key, createdAt }: ISummaryDTO) {
    super({ content, key, createdAt });
  }

  private minutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }

  protected calculateExpiration(createAt: Date, key: EnumTimeLimit): Date {
    return new Date(createAt.getTime() + this.minutesToMilliseconds(key));
  }
}

export { ISummaryDTO, Summary };
