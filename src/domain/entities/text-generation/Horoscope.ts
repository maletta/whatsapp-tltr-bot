import { EnumHoroscope } from 'domain/enums/text-generation/Horoscope';
import { DateUtils } from 'utils/Date.utils';

import { BaseModel } from '../../interfaces/entities/BaseModel';

interface IHoroscopeDTO {
  key: EnumHoroscope;
  content: string;
  createdAt?: Date;
}

class Horoscope extends BaseModel<EnumHoroscope> {
  constructor({ content, key, createdAt }: IHoroscopeDTO) {
    super({ content, key, createdAt });
  }
  protected calculateExpiration(createdAt: Date): Date {
    return DateUtils.getEndOfDay(createdAt);
  }
}

export { IHoroscopeDTO, Horoscope };
