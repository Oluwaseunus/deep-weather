import axios from 'axios';
import { getUrlSlug } from '../utils/functions';
import StorageService from '../utils/StorageService';

export default class WeatherService {
  private static apiKey = process.env.REACT_APP_OWM_API_KEY;
  private static instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
  });

  static async getCityWeather(cityName: string): Promise<OWMResponse> {
    const slugName = getUrlSlug(cityName);
    const dataName = slugName + '-data';
    const localData = StorageService.get<OWMResponse>(dataName);

    if (!localData) {
      const { data } = await this.instance.get<OWMResponse>(
        `/weather?q=${cityName}&appid=${this.apiKey}&units=imperial`
      );
      StorageService.store(slugName + '-data', data);
      return data;
    } else {
      return localData;
    }
  }

  static async getWeatherByCoords({
    latitude,
    longitude,
  }: Pick<
    GeolocationCoordinates,
    'latitude' | 'longitude'
  >): Promise<OWMResponse> {
    const { data } = await this.instance.get<OWMResponse>(
      `/weather?lat=${latitude}&lon=${longitude}&appId=${this.apiKey}&units=imperial`
    );
    return data;
  }
}
