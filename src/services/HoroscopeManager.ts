import { EnumHoroscope } from 'enums/Horoscope';
import { Horoscope } from 'models/Horoscope';

class HoroscopeManager {
  // The `horoscopes` map holds EnumHoroscope as keys and Horoscope as values.
  // It is used to store horocospe previsions.
  private horoscopes: Map<EnumHoroscope, Horoscope>;

  constructor() {
    this.horoscopes = new Map();
  }

  // Adds a new horoscope to the `horoscopes` map using the provided key and horoscope.
  public add(key: EnumHoroscope, text: string) {
    this.delete(key);
    const horoscope = new Horoscope({ content: text, sign: key });
    this.horoscopes.set(key, horoscope);
  }

  public getHoroscopeById(key: EnumHoroscope): Horoscope | null {
    if (this.horoscopes.has(key)) {
      return this.horoscopes.get(key);
    }
    return null;
  }

  // Deletes the horoscope associated with the given key from the `horoscopes` map.
  public delete(key: EnumHoroscope) {
    if (this.horoscopes.has(key)) {
      this.horoscopes.delete(key);
    }
  }

  // Checks if there is a valid horoscope available for the given key.
  // Returns true if the key exists and the horoscope has not expired,
  // otherwise, it returns false.
  public hasValidHoroscope(key: EnumHoroscope) {
    if (this.horoscopes.has(key)) {
      const horoscope = this.horoscopes.get(key);
      if (new Date().getTime() < horoscope.expiresIn.getTime()) {
        return true;
      }
    }

    return false;
  }
}
export { HoroscopeManager };
