import { topCities } from './constants';

export default class CityService {
  static getTopCities(): string[] {
    const localCities = localStorage.getItem('topCities');
    if (localCities) {
      return JSON.parse(localCities);
    } else {
      localStorage.setItem('topCities', JSON.stringify(topCities));
      return topCities;
    }
  }

  static removeCity(cityName: string) {
    const localCities = localStorage.getItem('topCities');
    const cityNames: string[] = localCities
      ? JSON.parse(localCities)
      : topCities;

    const updatedCities = cityNames.filter((name) => name !== cityName);
    localStorage.setItem('topCities', JSON.stringify(updatedCities));
  }
}
