import { EnumTimeLimit, TimeLimitOption } from './TimeLimit';

interface ISummaryDTO {
  id?: string;
  timeLimit: TimeLimitOption;
  content: string;
  createdAt?: Date;
  expiresIn?: Date;
}

class Summary {
  public id: string;
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

  public isValid(): boolean {
    const now = Date.now();
    if (now < this.expiresIn.getTime()) {
      return true;
    }

    return false;
  }

  public formatExpiration(): string {
    const expirationTimeMs = this.expiresIn.getTime() - Date.now();

    if (expirationTimeMs < 0) {
      return 'expirado';
    }
    const now = new Date();
    const expiration = new Date(now.getTime() + expirationTimeMs);

    return this.formatDate(expiration);
  }

  public formatCreatedAt(): string {
    return this.formatDate(this.createdAt);
  }

  private formatDate(date: Date): string {
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const yy = String(date.getUTCFullYear()).slice(-2);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');

    return `${dd}-${mm}-${yy} ${hh}:${min}:${ss}`;
  }
}

export { ISummaryDTO, Summary };
