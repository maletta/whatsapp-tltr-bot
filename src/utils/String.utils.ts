class StringUtils {
  static removeAccents = (str: string) : string | null => {
    console.log('sting to replace ', str);
    try {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  static formatDateToString = (date: Date): string => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${dd}-${mm}-${yy} ${hh}:${min}:${ss}`;
  };
}

export { StringUtils };
