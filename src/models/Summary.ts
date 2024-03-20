import { EnumTimeLimit, TimeLimitOption } from 'enums/TimeLimit';

interface ISummaryDTO {
  key: TimeLimitOption;
  content: string;
  createdAt?: Date;
}

class Summary {
  public key: TimeLimitOption;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  constructor({ content, createdAt = new Date(), key }: ISummaryDTO) {
    this.key = key;
    this.content = content;
    this.createdAt = createdAt;
    this.expiresIn = new Date(
      createdAt.getTime() + this.minutesToMilliseconds(EnumTimeLimit[key]),
    );
  }

  private minutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }

  public isValid = (): boolean => {
    const now = Date.now();
    if (now < this.expiresIn.getTime()) {
      return true;
    }

    return false;
  };
}

export { ISummaryDTO, Summary };
