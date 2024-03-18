enum EnumHoroscope {
  Aries = 'Áries',
  Touro = 'Touro',
  Gemeos = 'Gêmeos',
  Cancer = 'Câncer',
  Leao = 'Leão',
  Virgem = 'Virgem',
  Libra = 'Libra',
  Escorpiao = 'Escorpião',
  Sagitario = 'Sagitário',
  Capricornio = 'Capricórnio',
  Aquario = 'Aquário',
  Peixes = 'Peixes',
}

type IHoroscopeOption = keyof typeof EnumHoroscope;

export { EnumHoroscope, IHoroscopeOption };
