interface OWMResponse {
  dt: number;
  id: number;
  cod: number;
  base: string;
  name: string;
  timezone: number;
  visibility: number;
  clouds: {
    all: number;
  };
  coord: {
    lon: number;
    lat: number;
  };
  wind: {
    deg: number;
    speed: number;
  };
  sys: {
    id: number;
    type: number;
    sunset: number;
    message: number;
    country: string;
    sunrise: number;
  };
  weather: [
    {
      id: number;
      main: string;
      icon: string;
      description: string;
    }
  ];
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    feels_like: number;
  };
}
