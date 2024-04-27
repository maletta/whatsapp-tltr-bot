class StringUtils {
  static removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

  static replaceBreakingLines = (text: string): string => {
    return text.replace(/\\n/gm, '\n');
  };
}

export { StringUtils };
