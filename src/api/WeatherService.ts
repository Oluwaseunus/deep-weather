import axios from 'axios';

export default class WeatherService {
  private static apiKey = process.env.REACT_APP_OWM_API_KEY;
  private static instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
  });

  static async getCityWeather(cityName: string) {
    const { data } = await this.instance.get<OWMResponse>(
      `/weather?q=${cityName}&appid=${this.apiKey}&units=metric`
    );
    return data;
  }
}
