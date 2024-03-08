// in minutes
enum EnumTimeLimit {
  '30_MINUTES' = 30,
  '1_HOUR' = 60,
  '2_HOURS' = 120,
  '4_HOURS' = 240,
  '6_HOURS' = 360,
}

type TimeLimitKey = keyof typeof EnumTimeLimit;

export { EnumTimeLimit, TimeLimitKey };
