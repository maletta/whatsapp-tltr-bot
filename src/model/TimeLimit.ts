// in minutes
enum EnumTimeLimit {
  '30_MINUTES' = 30,
  '1_HOUR' = 60,
  '2_HOURS' = 120,
  '4_HOURS' = 240,
  '6_HOURS' = 360,
}

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
}

type TimeLimitOption = keyof typeof EnumTimeLimit;

export { EnumTimeLimit, TimeLimitOption, TimeLimit };
