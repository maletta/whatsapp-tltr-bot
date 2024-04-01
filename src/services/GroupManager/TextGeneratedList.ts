import { BaseModel } from 'models/BaseModel';

class TextGeneratedList<
  T extends Enumerator,
  GeneratedTextModel extends BaseModel<T>,
> {
  private horoscopes: Map<T, GeneratedTextModel>;

  constructor() {
    this.horoscopes = new Map();
  }

  // Adds a new horoscope to the `horoscopes` map using the provided key and horoscope.
  public add(key: T, text: string) {
    this.delete(key);
    const horoscope = new GeneratedTextModel({ content: text, key });
    this.horoscopes.set(key, horoscope);
  }

  public getHoroscopeById(key: T): GeneratedTextModel | null {
    if (this.horoscopes.has(key)) {
      return this.horoscopes.get(key);
    }
    return null;
  }

  // Deletes the horoscope associated with the given key from the `horoscopes` map.
  public delete(key: T) {
    if (this.horoscopes.has(key)) {
      this.horoscopes.delete(key);
    }
  }

  // Checks if there is a valid horoscope available for the given key.
  // Returns true if the key exists and the horoscope has not expired,
  // otherwise, it returns false.
  public hasValidHoroscope(key: T) {
    if (this.horoscopes.has(key)) {
      const horoscope = this.horoscopes.get(key);
      if (new Date().getTime() < horoscope.expiresIn.getTime()) {
        return true;
      }
    }

    return false;
  }
}
