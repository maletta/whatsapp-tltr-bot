// in minutes
enum EnumTimeLimit {
  '30_MINUTES' = 30,
  '1_HOUR' = 60,
  '2_HOURS' = 120,
  '4_HOURS' = 240,
  '6_HOURS' = 360,
}
type TimeLimitOption = keyof typeof EnumTimeLimit;

export type TimeLimitTranslation = {
  [key in TimeLimitOption]: string;
};

class TimeLimit {
  // valid if  timestamp is between start and end of given time limit
  public static isBetweenTimeLimit(
    timestamp: number,
    timeLimit: EnumTimeLimit,
  ) {
    const timestampMilli = new Date(timestamp * 1000); // converte para milissegundos
    const agora = Date.now();

    const diffInMilli = agora - timestampMilli.getTime();
    const diffInMinutes = Math.floor(diffInMilli / 60000);

    return diffInMinutes < timeLimit;
  }

  public static translateTimeLimit(timelimit: TimeLimitOption) {
    const translated: TimeLimitTranslation = {
      '30_MINUTES': '30 minuitos',
      '1_HOUR': '1 hora',
      '2_HOURS': '2 horas',
      '4_HOURS': '4 horas',
      '6_HOURS': '6 horas',
    };

    return translated[timelimit];
  }
}

export { EnumTimeLimit, TimeLimitOption, TimeLimit };
