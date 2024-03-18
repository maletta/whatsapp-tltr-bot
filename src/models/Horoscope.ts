import { EnumHoroscope } from '@enums/Horoscope';
import { DateUtils } from '@utils/Date.utils';

interface IHoroscopeDTO {
  sign: string;
  content: string;
  createdAt?: Date;
}

class Horoscope {
  public sign: EnumHoroscope;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  constructor({ content, createdAt = new Date() }: IHoroscopeDTO) {
    this.content = content;
    this.createdAt = createdAt;
    this.expiresIn = DateUtils.getEndOfDay(this.createdAt);
  }

  public isValid = (): boolean => {
    const now = Date.now();
    if (now < this.expiresIn.getTime()) {
      return true;
    }

    return false;
  };
}

export { IHoroscopeDTO, Horoscope };
