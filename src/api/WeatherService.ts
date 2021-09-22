import axios from 'axios';

export default class WeatherService {
  private static apiKey = process.env.REACT_APP_OWM_API_KEY;
  private static instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
  });

  static async getCityWeather(cityName: string) {
    const dataName = cityName + '-data';
    const localData = localStorage.getItem(dataName);

    if (!localData) {
      const { data } = await this.instance.get<OWMResponse>(
        `/weather?q=${cityName}&appid=${this.apiKey}&units=imperial`
      );
      localStorage.setItem(cityName + '-data', JSON.stringify(data));
      return data;
    } else {
      return JSON.parse(localData);
    }
  }
}
