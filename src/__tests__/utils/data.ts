export const istanbulData: OWMResponse = {
  base: 'stations',
  clouds: { all: 40 },
  cod: 200,
  coord: { lon: 28.9833, lat: 41.0351 },
  dt: 1632415411,
  id: 745042,
  main: {
    temp: 59.65,
    feels_like: 57.9,
    temp_min: 57.36,
    temp_max: 62.06,
    pressure: 1019,
    humidity: 55,
  },
  name: 'Istanbul',
  sys: {
    type: 1,
    id: 6970,
    country: 'TR',
    sunrise: 1632369148,
    sunset: 1632412827,
  },
  timezone: 10800,
  visibility: 10000,
  weather: [
    { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03n' },
  ],
  wind: { speed: 9.22, deg: 30 },
};

export const shangHaiData: OWMResponse = {
  base: 'stations',
  clouds: { all: 0 },
  cod: 200,
  coord: { lon: 121.4581, lat: 31.2222 },
  dt: 1632415180,
  id: 1796236,
  main: {
    temp: 77.83,
    feels_like: 79.12,
    temp_min: 75.07,
    temp_max: 78.66,
    pressure: 1018,
    humidity: 81,
  },
  name: 'Shanghai',
  rain: { '1h': 0.75 },
  sys: {
    type: 1,
    id: 9659,
    country: 'CN',
    sunrise: 1632433404,
    sunset: 1632476951,
  },
  timezone: 28800,
  visibility: 10000,
  weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10n' }],
  wind: { speed: 6.71, deg: 120 },
};

test('data file', () => {
  expect(true).toBe(true);
});
