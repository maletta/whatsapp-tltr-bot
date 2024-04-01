import { EnumHoroscope } from 'enums/Horoscope';
import { DateUtils } from 'utils/Date.utils';

import { BaseModel } from './BaseModel';

interface IHoroscopeDTO {
  key: EnumHoroscope;
  content: string;
  createdAt?: Date;
}

class Horoscope extends BaseModel<EnumHoroscope> {
  public key: EnumHoroscope;
  public content: string;
  public createdAt: Date;
  public expiresIn: Date;

  protected calculateExpiration(createdAt: Date): Date {
    return DateUtils.getEndOfDay(createdAt);
  }
}

export { IHoroscopeDTO, Horoscope };
