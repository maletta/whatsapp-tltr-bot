import { EnumTimeLimit, TimeLimitOption } from 'domain/enums/TimeLimit';

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

  public static translateTimeLimit(timelimit: EnumTimeLimit): string {
    switch (timelimit) {
      case EnumTimeLimit['1_HOUR']:
        return '1 hora';
      case EnumTimeLimit['2_HOURS']:
        return '2 horas';
      case EnumTimeLimit['4_HOURS']:
        return '4 horas';
      case EnumTimeLimit['6_HOURS']:
        return '6 horas';
      default:
        return '30 minutos';
    }
  }
}

export { TimeLimit };
