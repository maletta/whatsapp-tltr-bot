import { EnumHoroscope } from '@enums/Horoscope';

interface IHoroscopePrediction {
  prediction(sign: EnumHoroscope): Promise<string>;
}

export type { IHoroscopePrediction };
