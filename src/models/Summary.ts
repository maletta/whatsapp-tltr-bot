import { EnumTimeLimit, TimeLimitOption } from '@enums/TimeLimit';
import { StringUtils } from '@utils/String.utils';

interface ISummaryDTO {
  timeLimit: TimeLimitOption;
  content: string;
  createdAt?: Date;
}

class Summary {
  public timeLimit: TimeLimitOption;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  constructor({ content, createdAt = new Date(), timeLimit }: ISummaryDTO) {
    this.timeLimit = timeLimit;
    this.content = content;
    this.createdAt = createdAt;
    this.expiresIn = new Date(
      createdAt.getTime() +
        this.minutesToMilliseconds(EnumTimeLimit[timeLimit]),
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

  public formatExpiration = (): string => {
    const expirationTimeMs = this.expiresIn.getTime() - Date.now();

    if (expirationTimeMs < 0) {
      return 'expirado';
    }
    const now = new Date();
    const expiration = new Date(now.getTime() + expirationTimeMs);

    return StringUtils.formatDateToString(expiration);
  };

  public formatCreatedAt = (): string => {
    return StringUtils.formatDateToString(this.createdAt);
  };
}

export { ISummaryDTO, Summary };
