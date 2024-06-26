import { EnumHoroscope } from 'domain/enums/text-generation/Horoscope';
import { StringUtils } from 'utils/String.utils';

class HoroscopeValidator {
  static isValidHoroscope(horoscope: string): boolean {
    const normalizedHoroscope =
      StringUtils.removeAccents(horoscope).toLowerCase();
    return Object.values(EnumHoroscope)
      .map((h) => StringUtils.removeAccents(h).toLowerCase())
      .includes(normalizedHoroscope);
  }

  static getValidHoroscope(horoscope: string): EnumHoroscope | null {
    const normalizedHoroscope =
      StringUtils.removeAccents(horoscope).toLowerCase();
    const foundHoroscope = Object.values(EnumHoroscope).find((h) => {
      return (
        StringUtils.removeAccents(String(h)).toLowerCase() ===
        normalizedHoroscope
      );
    });

    if (foundHoroscope) return foundHoroscope;

    return null;
  }
}

export { HoroscopeValidator };
