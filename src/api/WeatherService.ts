import axios from 'axios';
import { getUrlSlug } from '../utils/functions';

export default class WeatherService {
  private static apiKey = process.env.REACT_APP_OWM_API_KEY;
  private static instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
  });

  static async getCityWeather(cityName: string) {
    const slugName = getUrlSlug(cityName);
    const dataName = slugName + '-data';
    const localData = localStorage.getItem(dataName);

    if (!localData) {
      const { data } = await this.instance.get<OWMResponse>(
        `/weather?q=${cityName}&appid=${this.apiKey}&units=imperial`
      );
      localStorage.setItem(slugName + '-data', JSON.stringify(data));
      return data;
    } else {
      return JSON.parse(localData);
    }
  }

  static async getWeatherByCoords({
    latitude,
    longitude,
  }: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) {
    const { data } = await this.instance.get<OWMResponse>(
      `/weather?lat=${latitude}&lon=${longitude}&appId=${this.apiKey}&units=imperial`
    );
    return data;
  }
}
