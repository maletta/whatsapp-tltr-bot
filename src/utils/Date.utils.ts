class DateUtils {
  static getEndOfDay = (date: Date): Date => {
    const today = new Date(date.getTime());
    today.setHours(23, 59, 59, 999);
    return today;
  };
}

export { DateUtils };
